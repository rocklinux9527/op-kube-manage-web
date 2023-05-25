#!groovy
#!groovy
import groovy.json.JsonOutput
import groovy.json.JsonSlurperClassic
import groovy.transform.Field
import java.net.URLEncoder;


/**
 * @author wangxiamei
 */
/**
 * 定义全局常量
 */
@Field CHANGE_HOST = 'http://chehejia-devops-change-web.prod-devops.k8s.chj.cloud/chehejia-devops-change-web/v1-0'
@Field SERVICE_TYPE = "ChangE"
@Field OSS_BASE_PATH = "/devops/build" //oss 挂载路径
@Field REG_HOST = 'reg.chehejia.com'
@Field CI_HOST = 'http://bcs-devops-cqs-service.prod-devops.k8s.chj.cloud/bcs-devops-cqs-service/v1-0'

node {
  /**
   * 定义全局变量
   */
  // 定义变量
  def CHANGE_BUILD_DIR = "${env.WORKSPACE}/changeBuild" //自定义构建的目录
  def CHANGE_BUILD_DIR_ZIP = "${env.WORKSPACE}/changeBuildZip" //自定义构建的目录
  def startTime = System.currentTimeMillis()

  // 发布详细信息
  def historyInfo, historyInfoId, image, dockerImageName, appName, extraOpsFlag, pkgName
  //此次 git commit id,和message
  def status, targetFile, fullName, fullNamePKG, fullPath, md5, shortCommit

  try {
    /**
     * 保存一份历史记录
     */
    stage('save historyInfo') {
      def params = [
        "branch"        : "${GERRIT_BRANCH}",
        "commitId"      : "${GERRIT_PATCHSET_REVISION}",
        "projectName"   : "${GERRIT_PROJECT}",
        "commitMsg"     : "${GERRIT_CHANGE_SUBJECT}",
        "gitUrl"        : "${GERRIT_CHANGE_URL}",
        "triggerAccount": "${GERRIT_CHANGE_OWNER_EMAIL}",
        "jobName"       : "${JOB_NAME}",
        "logUrl"        : "http://change.chj.cloud/jenkins/job/${JOB_NAME}/${env.BUILD_ID}/consoleText"
      ]

      historyInfo = callback("$CI_HOST/ci/history", "${JsonOutput.toJson(params)}");
      extraOpsFlag = true;
      historyInfoId = historyInfo.id;
      appName = historyInfo.appName;
    }
    /**
     * 检出代码
     */
    stage('checkout') { // stage 1
      try {
        shortCommit = "${historyInfo.commitId}"
        def gitUrl = "${historyInfo.gitUrl}"
        checkout([$class: 'GitSCM', branches: [[name: shortCommit]], doGenerateSubmoduleConfigurations: false,
                  userRemoteConfigs: [[credentialsId: 'cd_change_jenkins', url: gitUrl]]])
        sh "git config credential.helper 'cache --timeout=300'" //  cache credentials (default: 300)

      } catch (Exception e) {
        throw new ChangEException("checkout失败")
      }
    }
    /**
     * build java|node|golang 需要build过程
     */
    stage('\u2777 package|| build') { //构建打包
      //删除gradle的构建目录
      if (historyInfo.buildType == "2") {
        sh "rm -rf ${env.WORKSPACE}/build"
      }
      if (historyInfo.buildType == "1" || historyInfo.buildType == "2" || historyInfo.buildType == "3" || historyInfo.buildType == "6") {
        sh 'rm -rf build.groovy'
        sh "wget $CHANGE_HOST/open/api/k8s/ci/build-file?ciId=${historyInfoId} -O build.groovy"
        load "build.groovy"
      }
    }
    stage('ready') {
      def version;
      sh "rm -rf ${CHANGE_BUILD_DIR}"
      sh "rm -rf ${CHANGE_BUILD_DIR_ZIP}"
      if (historyInfo.buildType == "1") {//maven
        version = sh(returnStdout: true, script: "mvn -Dexec.executable='echo' -Dexec.args='\${project.artifactId}: \${project.version}' exec:exec -q |grep '${appName}:'  | awk '{print \$2}'").trim()
        if (!version) {
          def pomXml = readFile("${env.WORKSPACE}/pom.xml");
          def project = new XmlParser().parseText(pomXml);
          version = project.version[0].text();
        }
      } else if (historyInfo.buildType == "2") {//gradle
        version = sh(returnStdout: true, script: "./gradlew properties -q | grep 'version:' | awk '{print \$2}'").trim()
      } else if (historyInfo.buildType == "3") {
        def log = readFile("${env.WORKSPACE}/package.json");
        def packagenContent = new JsonSlurperClassic().parseText(log)
        println "packagenContent:" + packagenContent
        version = packagenContent.version
      } else {
        try {
          //从.version文件中获取
          version = readFile("${env.WORKSPACE}/.version");
          println "readFile version:" + version
        } catch (Exception e) {
          println "read version from .version error:" + e
          //从commitmessage中获取
          String commitMessageEncode =  URLEncoder.encode("${GERRIT_CHANGE_SUBJECT}","UTF-8");
          def response = httpRequest "$CI_HOST/ci/version?commitMsg=${commitMessageEncode}";
          version = response.content
        }
      }
      println "version:" + version;
      if (!version) {
        version = "${shortCommit}"
      }
      def params = [
        "id"     : "${historyInfoId}",
        "version": "${version}"
      ]
      callback("$CI_HOST/ci/history/updateById", "${JsonOutput.toJson(params)}")
      targetFile = "${appName}-${version}"
      fullName = "${appName}-${version}-${historyInfo.commitId}-${env.BUILD_ID}-${SERVICE_TYPE}"
      fullNamePKG = "${fullName}.zip"
      fullPath = "$CHANGE_BUILD_DIR_ZIP/$fullName"
      //k8s
      dockerImageName = "${appName}:${version}-${historyInfo.commitId}"
      image = "${REG_HOST}/chj-k8s-change/${dockerImageName}"

      sh 'rm -rf Dockerfile'
      echo "获取Dockerfile"
      sh "wget $CHANGE_HOST/open/api/k8s/ci/dockerfile?ciId=${historyInfoId} -O Dockerfile"
    }
    stage("\u277A archive ") { //归档保存 // stage 4
      try {
        sh "mkdir -p ${CHANGE_BUILD_DIR_ZIP}/$fullName"
        sh "mkdir -p ${CHANGE_BUILD_DIR}"
        if (historyInfo.buildType == "1" || historyInfo.buildType == "2") {// 1 or 2 是Java项目
          pkgName = sh(returnStdout: true, script: "find ${env.WORKSPACE}/ -name ${targetFile}.jar").trim()
          if (!pkgName) {
            throw new ChangEException("未找到 $targetFile.jar|.war 文件退出发布 ")
          }
          print "查找$targetFile 路径结果[${pkgName}] "
          //k8s
          sh "cp -f $pkgName $CHANGE_BUILD_DIR"
          //vm
          sh "mkdir -p $fullPath/lib"
          sh "cp -f $pkgName $fullPath/lib/"
          sh "cd $CHANGE_BUILD_DIR_ZIP;zip -rq $fullNamePKG $fullName/*"
          md5 = sh(returnStdout: true, script: "md5sum ${pkgName} | cut -d ' ' -f1").trim();

        } else if (historyInfo.buildType == "3") {
          if (historyInfo.execType == "1") { //nodejs项目
            //k8s
            sh "cp -r `ls |grep -v build|grep -v .git|grep -v changeBuild` ${CHANGE_BUILD_DIR}/"
            //vm
            sh "cp -r `ls |grep -v build|grep -v .git|grep -v changeBuild` ${CHANGE_BUILD_DIR_ZIP}/$fullName"
            sh "wget $CHANGE_HOST/console/file/nodejs-console.sh -O ${CHANGE_BUILD_DIR_ZIP}/$fullName/console"
            sh "chmod a+x ${CHANGE_BUILD_DIR_ZIP}/$fullName/console"
            sh "cd ${CHANGE_BUILD_DIR_ZIP};zip -rq $fullNamePKG $fullName/*"
            md5 = sh(returnStdout: true, script: "md5sum $CHANGE_BUILD_DIR_ZIP/$fullNamePKG | cut -d ' ' -f1").trim()
          } else { // 纯静态项目
            //k8s nginx config
            sh "touch default.conf"
            //vm
            sh "mv dist/* ${CHANGE_BUILD_DIR_ZIP}/$fullName"
            sh "wget $CHANGE_HOST/console/file/nginx-console.sh -O ${CHANGE_BUILD_DIR_ZIP}/$fullName/console"
            sh "chmod a+x ${CHANGE_BUILD_DIR_ZIP}/$fullName/console"
            sh "cd $CHANGE_BUILD_DIR_ZIP;zip -rq $fullNamePKG $fullName/*"
            md5 = sh(returnStdout: true, script: "md5sum $CHANGE_BUILD_DIR_ZIP/$fullNamePKG | cut -d ' ' -f1").trim()
          }
        } else { //go ,python 语言
          //k8s

          //vm
          // 忽略不用部署的文件
          sh "cp -r `ls |grep -v changeBuild | grep -v check | grep -v wiki | grep -v pid | grep -v logs` ${CHANGE_BUILD_DIR_ZIP}/$fullName"
          sh "chmod a+x ${CHANGE_BUILD_DIR_ZIP}/$fullName/console"
          sh "cd $CHANGE_BUILD_DIR_ZIP;zip -yrq $fullNamePKG $fullName/*"

          md5 = sh(returnStdout: true, script: "md5sum $CHANGE_BUILD_DIR_ZIP/$fullNamePKG | cut -d ' ' -f1").trim()
        }
        //k8s 生成docker image
        sh "docker build . -t ${image}"
        sh "docker push ${image}"

        status = 1 //构建成功
        def params = [
          "id"       : "${historyInfoId}",
          "pkgName"  : "$fullNamePKG",
          "imageName": "${image}",
          "status"   : status,
          "md5"      : "${md5}"
        ]
        callback("$CI_HOST/ci/history/updateById", "${JsonOutput.toJson(params)}")
        uploadOss("${appName}", "$CHANGE_BUILD_DIR_ZIP/$fullNamePKG")
      } catch (Exception e) {
        throw new ChangEException("打包上传失败 ${e.getMessage()}")
      }
    }
  } catch (Exception e) {
    def params = [
      "id"    : "${historyInfoId}",
      "status": 0
    ]
    extraOpsFlag = false;
    callback("$CI_HOST/ci/history/updateById", "${JsonOutput.toJson(params)}")
    print e

    throw new ChangEException("执行异常了 ")
  } finally {
    long times = (System.currentTimeMillis() - startTime) / 1000 as int// 发布耗时
    def params = [
      "id"      : "${historyInfoId}",
      "costTime": "${times}"
    ]
    callback("$CI_HOST/ci/history/updateById", "${JsonOutput.toJson(params)}")
  }
  /**
   * jar包依赖分析 此项只适用于Java开发语言,即使依赖分析出错，也不影响CI的结果
   */
  if (historyInfo.buildType == "1" && extraOpsFlag == true ) { //暂注掉 gradlew 分析
    stage('dependency') {
      try {
        println "jar包依赖分析"

        def dependencyResult, regex = "\\-\\d{1,3}\\.", jarNameList = []
        if (pkgName) {
          dependencyResult = sh returnStdout: true, script: "unzip -v $pkgName |grep BOOT-INF/lib/ |awk '{print \$8}'"
          dependencyResult = dependencyResult.replaceAll("BOOT-INF/lib/", "")

          def dependencyListArr
          if (historyInfo.buildType == "1") { // maven
            sh "rm -rf mvn_dependency_tree.txt"
            sh "mvn dependency:list -DoutputFile=`pwd`/mvn_dependency_tree.txt -DappendOutput=false"
            def dependencyListStr = readFile file: "mvn_dependency_tree.txt"
            dependencyListArr = dependencyListStr.split("\n")

          } else if (historyInfo.buildType == "2") { // gradlew
            def dependencyListStr = sh returnStdout: true, script: "./gradlew dependencies --configuration compile"
            dependencyListStr = dependencyListStr.replaceAll("\\+---", "").replaceAll("\\---", "").replaceAll("\\\\", "").replaceAll("\\|", "");
            dependencyListArr = dependencyListStr.split("\n")
          }
          def dependencyResultArray = dependencyResult.split("\n")
          dependencyResultArray.each {
            def jarInfoArray = it.trim().split(regex)
            def jarName = jarInfoArray[0]
            def version = it.trim().replace(jarName, "").replace(".jar", "")
            version = version.replaceFirst("-", "")
            if (jarName != "") {
              dependencyListArr.each {
                if (it.contains(":${jarName}:")) {
                  def fullJarInfo = it.trim().split(":")
                  if (historyInfo.buildType == "1") { //maven
                    jarNameList.add([
                      "groupId"   : fullJarInfo[0],
                      "artifactId": fullJarInfo[1],
                      "version"   : version
                    ])
                  } else {
                    jarNameList.add([
                      "groupId"   : fullJarInfo[0],
                      "artifactId": fullJarInfo[1],
                      "version"   : version
                    ])
                  }
                }
              }
            }
          }
          def result = [
            "commitId"         : "${historyInfo.commitId}",
            "appId"            : "${historyInfo.appId}",
            "env"              : "ci",
            "appName"          : "${appName}",
            "jarCoordinateList": jarNameList
          ]
          httpRequest url: "$CHANGE_HOST/open/api/dependency", contentType: 'APPLICATION_JSON_UTF8', httpMode: 'POST', requestBody: "${JsonOutput.toJson(result)}"

        }
      } catch (Exception e) {
        println "分析依赖包出错！"
        print e
      }
    }
  }

  //清理资源
  if (historyInfo.buildType == "1") {//maven
    sh "mvn clean"
  } else if (historyInfo.buildType == "2") {//gradle
    sh "./gradlew clean"
  }
}
// 执行回调
def callback(String url, String json) {
  def response = httpRequest url: url, contentType: 'APPLICATION_JSON_UTF8', httpMode: 'POST', requestBody: json
  print("回调结果 ${response.status}")
  if (response.status == 200) {
    def responseContent = new JsonSlurperClassic().parseText(response.content)
    println responseContent
    return responseContent;
  }

  throw new ChangEException("回调异常")

}

/**
 * 上传构建包到 OSS
 * @param appName 应用名称
 * @param fullPathPkg 本地包文件
 */
def uploadOss(GString appName, GString fullPathPkg) {
  def ossAppPath = "$OSS_BASE_PATH/$appName"
  sh "sudo mkdir -p $ossAppPath"
  sh "sudo cp $fullPathPkg $ossAppPath"
}

//自定义嫦娥Chang E 系统异常
class ChangEException extends RuntimeException {

  ChangEException(String msg) {
    super(msg)
  }
}
