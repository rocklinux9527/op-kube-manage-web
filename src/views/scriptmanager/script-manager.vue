<template>
  <div class="app-container">

      <el-form label-width="80px" v-model="postForm">
    <el-form-item label="名称:">
      <el-input v-model="postForm.name"></el-input>
    </el-form-item>
    <el-form-item label="脚本名称:">
      <el-input v-model="postForm.appName"></el-input>
    </el-form-item>
    <el-form-item label="类型:">

      <el-select placeholder="请选择" v-model="postForm.type">
        <el-option
          :key="item.key"
          :label="item.key"
          :value="item.value"
          v-for="item in typeArray">
        </el-option>
      </el-select>

    </el-form-item>
    <el-form-item label="语言:">
      ；
      <el-select @change="changeLanguage" placeholder="请选择" v-model="postForm.language">
        <el-option
          :key="item"
          :label="item"
          :value="item"
          v-for="item in languageArray">
        </el-option>
      </el-select>

    </el-form-item>
    <el-form-item label="内容:">
      <codemirror :options="cmOptions" :value="postForm.content" ref="contentEditor"></codemirror>
    </el-form-item>
    <el-form-item label="备注:">
      <el-input type="textarea" v-model="postForm.remark"></el-input>
    </el-form-item>

    <el-form-item>

      <router-link :to="'/plainText'">
        <el-button :to="'/plainText'" type="primary">返回</el-button>
      </router-link>

      <el-button @click="save" style="margin-left: 50px" type="success">保存</el-button>
    </el-form-item>
  </el-form>
    <!--<div slot="footer" class="dialog-footer">-->
    <!--<el-button>取 消</el-button>-->
    <!--<el-button type="primary">关闭</el-button>-->
    <!--</div>-->

  </div>
</template>
<style>
  .CodeMirror {
    min-height: 48px;
    border: 1px solid #eee;
    height: auto;
    line-height: 24px;
  }

  .CodeMirror-scroll {
    height: auto;
    overflow-y: hidden;
    overflow-x: auto;
  }
</style>
<script>
  import {codemirror} from 'vue-codemirror';
  import "codemirror/mode/python/python.js";
  import "codemirror/mode/groovy/groovy.js"
  import "codemirror/mode/nginx/nginx.js"
  import "codemirror/mode/shell/shell.js"
  import "codemirror/mode/xml/xml.js"
  import "codemirror/mode/yaml/yaml.js"
  import "codemirror/mode/dockerfile/dockerfile.js"

  export default {
    name: 'TextFileForm',
    components: {
      codemirror
    },
    data() {
      return {
        languageArray: [
          'dockerfile',
          'nginx',
          'groovy',
          'shell',
          'xml',
          'yaml',
          'python',
          'go'
        ],
        typeArray: [
          {value: '1', key: 'jenkins job'},
          {value: '2', key: 'jenkins file'},
          {value: '3', key: 'jenkins file segment'},
          {value: '4', key: 'nginx conf'},
          {value: '5', key: 'dockerfile'},
          {value: '6', key: 'k8s deployment'},
          {value: '7', key: 'k8s service'},
        ],
        cmOptions: {
          // <!-- 以什么格式进行高亮 -->
          mode: "nginx",
          // <!-- 主题 -->
          //  theme: 'seti',
          // <!-- 是否代码折叠 -->
          lineWrapping: true,
          // <!-- 是否在编辑器左侧显示行号 -->
          lineNumbers: true,
          // <!-- 行号从哪个数开始计数，默认为1 -->
          firstLineNumber: 1,

          // <!-- tab字符的宽度，默认为4 -->
          indentWithTabs: true,
          // <!-- 自动缩进，设置是否根据上下文自动缩进,默认为true-->
          smartIndent: true,
          // <!-- 括号匹配 -->
          matchBrackets: true,
          // <!-- 是否在初始化时自动获取焦点 -->
          autofocus: true,
          // <!-- 智能提示  -->
          extraKeys: {"Ctrl-Space": "autocomplete"},
          // <!-- 编辑器是否只读,并且不能获得焦点 -->
          readOnly: false,
          // <!-- 在选择时是否显示光标，默认为false -->
          showCursorWhenSelecting: true
        },
        postForm: {
          id: undefined,
          name: '',
          appName: '',
          content: '',
          type: '',
          language: 'shell',
          remark: ''
        },
        loading: false
      }
    },
    created() {
      let id = this.$route.params && this.$route.params.id
      if (id) {
        this.detail(id)
      }
    },
    methods: {
      changeLanguage(item) {
        this.cmOptions.mode = item
      },
      detail(id) {
        textFileDetail(id).then(response => {
          this.postForm = response.data;
        })
      },
      content() {
        this.postForm.content = this.$refs.contentEditor.codemirror.getValue();
      },
      save() {
        // this.loading = true
        // this.content();
        //
        // delete this.postForm.createtime;
        // delete this.postForm.updatetime;
        textFileSave(this.postForm).then(response => {
          this.loading = false

          Notification({
            message: response.data,
            duration: 5 * 1000,
            closable: true
          });
          location.href = "#/plainText"
        }).catch(err => {
          this.loading = false
        })
      }
    },
  }
</script>
