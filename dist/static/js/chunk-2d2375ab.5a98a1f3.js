(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d2375ab"],{fb81:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("div",{staticClass:"filter-container"},[a("el-input",{staticClass:"filter-item",staticStyle:{width:"200px"},attrs:{placeholder:"请输入应用名称模糊查询"},model:{value:e.listQuery.app_name,callback:function(t){e.$set(e.listQuery,"app_name",t)},expression:"listQuery.app_name"}}),a("el-button",{staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-search"},on:{click:function(t){return e.searchBtn()}}},[e._v(" 搜索 ")]),a("el-button",{staticClass:"filter-item",staticStyle:{"margin-left":"10px"},attrs:{type:"primary",icon:"el-icon-edit"},on:{click:e.handleCreate}},[e._v(" 新建 ")])],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.listLoading,expression:"listLoading"}],key:e.tableKey,staticStyle:{width:"100%"},attrs:{data:e.testData,border:"","highlight-current-row":""}},[e._l(e.columns,(function(e){return a("el-table-column",{attrs:{"show-overflow-tooltip":"",label:e.alias,prop:e.name,align:"center"}})})),a("el-table-column",{attrs:{label:"操作",align:"center",width:"230","class-name":"small-padding fixed-width"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.row;return[a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(t){return e.handleUpdate(s)}}},[e._v(" 修改 ")]),"deleted"!=s.status?a("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(t){return e.deleteKubeDeployList(s)}}},[e._v(" 删除 ")]):e._e()]}}])})],2),a("br"),a("div",{staticClass:"block"},[a("span",{staticClass:"demonstration"}),a("el-pagination",{attrs:{"current-page":e.listQuery.page,"page-sizes":[1,5,10,100],"page-size":e.listQuery.page_zie,layout:"total, sizes, prev, pager, next, jumper",total:e.kube_total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1),a("el-dialog",{attrs:{title:e.textMap[e.dialogStatus],visible:e.dialogFormVisible},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[a("el-form",{ref:"dataForm",staticStyle:{width:"500px","margin-left":"30px"},attrs:{rules:e.rules,model:e.k8sClusterData,"label-position":"left","label-width":"80px"}},[a("el-form-item",{attrs:{label:"环境",prop:"env"}},[a("el-select",{staticClass:"filter-item",staticStyle:{width:"420px"},attrs:{placeholder:"请选择环境",clearable:""},model:{value:e.k8sClusterData.env,callback:function(t){e.$set(e.k8sClusterData,"env",t)},expression:"k8sClusterData.env"}},e._l(e.envList,(function(e){return a("el-option",{key:e,attrs:{label:e,value:e}})})),1)],1),a("el-form-item",{attrs:{label:"集群",prop:"cluster"}},[a("el-select",{staticClass:"filter-item",staticStyle:{width:"420px"},attrs:{placeholder:"请选择集群名称标识",clearable:""},model:{value:e.k8sClusterData.cluster,callback:function(t){e.$set(e.k8sClusterData,"cluster",t)},expression:"k8sClusterData.cluster"}},e._l(e.ClusterList,(function(e){return a("el-option",{key:e,attrs:{label:e,value:e}})})),1)],1),a("el-form-item",{attrs:{label:"NS",prop:"namespace"}},[a("el-select",{staticClass:"filter-item",staticStyle:{width:"420px"},attrs:{placeholder:"请选择ns标识",clearable:""},model:{value:e.k8sClusterData.namespace,callback:function(t){e.$set(e.k8sClusterData,"namespace",t)},expression:"k8sClusterData.namespace"}},e._l(e.nsList,(function(e){return a("el-option",{key:e,attrs:{label:e,value:e}})})),1)],1),a("el-form-item",{attrs:{label:"应用",prop:"app_name"}},[a("el-input",{attrs:{placeholder:"请输入应用标识",clearable:""},model:{value:e.k8sClusterData.app_name,callback:function(t){e.$set(e.k8sClusterData,"app_name",t)},expression:"k8sClusterData.app_name"}})],1),a("el-form-item",{attrs:{label:"resources",prop:"resources"}},[a("el-input",{attrs:{placeholder:"请输入集群资源限制默认1c2g",clearable:""},model:{value:e.k8sClusterData.resources,callback:function(t){e.$set(e.k8sClusterData,"resources",t)},expression:"k8sClusterData.resources"}})],1),a("el-form-item",{attrs:{label:"副本数",prop:"replicas"}},[a("el-input-number",{staticStyle:{width:"420px"},attrs:{min:1,max:10},model:{value:e.k8sClusterData.replicas,callback:function(t){e.$set(e.k8sClusterData,"replicas",t)},expression:"k8sClusterData.replicas"}})],1),a("el-form-item",{attrs:{label:"镜像方式"}},[a("el-radio-group",{model:{value:e.formMode,callback:function(t){e.formMode=t},expression:"formMode"}},[a("el-radio",{attrs:{label:"manual"}},[e._v("手动填写")]),a("el-radio",{attrs:{label:"auto"},on:{change:function(t){return e.get_images_list()}}},[e._v("Harbor获取 ")])],1)],1),"manual"===e.formMode?a("el-form-item",{attrs:{label:"image",prop:"image"}},[a("el-input",{attrs:{placeholder:"请输入镜像地址",clearable:""},model:{value:e.k8sClusterData.image,callback:function(t){e.$set(e.k8sClusterData,"image",t)},expression:"k8sClusterData.image"}})],1):a("el-form-item",{attrs:{label:"image",prop:"image"}},[a("el-select",{staticStyle:{width:"420px"},attrs:{placeholder:"请选择镜像地址",clearable:""},model:{value:e.k8sClusterData.image,callback:function(t){e.$set(e.k8sClusterData,"image",t)},expression:"k8sClusterData.image"}},e._l(e.imageOptions,(function(e){return a("el-option",{key:e,attrs:{label:e,value:e}})})),1)],1),a("el-form-item",{attrs:{label:"环境变量",prop:"deploy_env"}},[a("el-input",{attrs:{placeholder:"请输入环境变量",clearable:""},model:{value:e.k8sClusterData.deploy_env,callback:function(t){e.$set(e.k8sClusterData,"deploy_env",t)},expression:"k8sClusterData.deploy_env"}})],1),a("el-form-item",{attrs:{label:"端口",prop:"ports",rules:[{validator:e.validatekubePort,trigger:"blur"}]}},[a("el-input",{attrs:{placeholder:"请输入应用监听端口",clearable:""},model:{value:e.k8sClusterData.ports,callback:function(t){e.$set(e.k8sClusterData,"ports",t)},expression:"k8sClusterData.ports"}})],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogFormVisible=!1}}},[e._v(" 取消 ")]),a("el-button",{attrs:{type:"primary"},on:{click:function(t){"create"===e.dialogStatus?e.postKubeDeployList():e.updateK8SDeploy()}}},[e._v(" 提交 ")])],1)],1),a("el-dialog",{attrs:{visible:e.dialogPvVisible,title:"Reading statistics"},on:{"update:visible":function(t){e.dialogPvVisible=t}}},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.pvData,border:"",fit:"","highlight-current-row":""}},[a("el-table-column",{attrs:{prop:"key",label:"Channel"}}),a("el-table-column",{attrs:{prop:"pv",label:"Pv"}})],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.dialogPvVisible=!1}}},[e._v("Confirm")])],1)],1)],1)},l=[],i=(a("d3b7"),a("159b"),a("b775"));function r(e){return Object(i["a"])({url:"/v1/kube/env/list/",method:"get",params:e})}function n(e){return Object(i["a"])({url:"/v1/db/k8s/ns/all/",method:"get",params:e})}function o(e){return Object(i["a"])({url:"/v1/kube/cluster/List/",method:"get",params:e})}function u(e){return Object(i["a"])({url:"/api/image",method:"get",params:e})}function c(e){return Object(i["a"])({url:"/v1/k8s/deployment/plan/",method:"get",params:e})}function p(e){return Object(i["a"])({url:"/v1/k8s/deployment/plan/",method:"post",data:e})}function m(e){return Object(i["a"])({url:"/v1/k8s/deployment/plan/",method:"put",data:e})}function d(e){return Object(i["a"])({url:"/v1/k8s/deployment/plan/",method:"delete",data:e})}var g={data:function(){return{formMode:"manual",kube_total:0,clearValidate:"",hostTotal:0,currentPage:1,pageSize:5,testData:[],columns:[],tableKey:0,list:null,total:0,listLoading:!0,listQuery:{app_name:"",page:1,page_size:5},envList:[],nsList:[],imageOptions:[],importanceOptions:[1,2,3],showReviewer:!1,k8sClusterData:{app_name:"",deployment_name:"",env:"",cluster:"",namespace:"",resources:"1c2g",replicas:1,image:"",deploy_env:"",project_name:"k8s",ports:80,affinity:"string",ant_affinity:"string",volumeMounts:"string",volume:"string",image_pull_secrets:"",health_liven_ess:"/",health_readiness:"/"},ClusterList:[],dialogFormVisible:!1,dialogStatus:"",textMap:{update:"Edit",create:"Add"},dialogPvVisible:!1,pvData:[],rules:{app_name:[{required:!0,message:"应用名称不能为空",trigger:"blur"}],env:[{required:!0,message:"环境不能为空",trigger:"blur"}],cluster:[{required:!0,message:"集群不能为空",trigger:"blur"}],namespace:[{required:!0,message:"命名空间名称不能为空",trigger:"blur"}],image:[{required:!0,message:"应用镜像地址不能为空",trigger:"blur"}],ports:[{required:!0,message:"应用端口不能为空",trigger:"blur"}],deploy_env:[{required:!0,message:"环境变量",trigger:"blur"}]},downloadLoading:!1}},created:function(){this.getKubeDeployList(),this.getenvList(),this.getClusterList(),this.getnsList()},methods:{searchBtn:function(){var e=this;c(this.listQuery).then((function(t){e.columns=t.columns,e.testData=t.data,e.kube_total=t.total,e.listLoading=!1}))},closeDialogfun:function(){this.dialogCicdFormVisible=!1},handleSizeChange:function(e){this.listQuery.page_size=e,this.getKubeDeployList()},handleCurrentChange:function(e){this.listQuery.page=e,this.getKubeDeployList()},getenvList:function(){var e=this;r(this.listQuery).then((function(t){var a=t.data;a&&a.forEach((function(t){e.envList.push(t)}))}))},getClusterList:function(){var e=this;o(this.listQuery).then((function(t){var a=t.data;a&&a.forEach((function(t){e.ClusterList.push(t)}))}))},getnsList:function(){var e=this;n(this.listQuery).then((function(t){var a=t.data;a&&a.forEach((function(t){e.nsList.push(t)}))}))},get_images_list:function(){var e=this;this.k8sClusterData.app_name?u(this.k8sClusterData).then((function(t){e.imageOptions=t.data})).catch((function(e){console.error("获取镜像地址选项失败:",e)})):this.$message.warning("请先输入应用标识")},getKubeDeployList:function(){var e=this;c(this.listQuery).then((function(t){e.columns=t.columns,e.testData=t.data,e.kube_total=t.total,e.listLoading=!1}))},handleFilter:function(){this.listQuery.page=1,this.getKubeDeployList()},validateReplicas:function(e,t,a){var s=parseInt(t,10);isNaN(s)?a(new Error("请输入数字")):s>10?a(new Error("单个应用副本数不能大于10")):a()},validatekubePort:function(e,t,a){var s=parseInt(t,10);isNaN(s)?a(new Error("请输入数字")):s>65535?a(new Error("端口号不能大于65535!")):a()},postKubeDeployList:function(){var e=this;this.$refs.dataForm.validate((function(t){t?p(e.k8sClusterData).then((function(t){e.dialogFormVisible=!1,e.$notify({title:"Success",message:"Created Successfully",type:"success",duration:2e3}),e.getKubeDeployList()})):e.$notify.error({title:"Error",message:"请填写完整的表单信息,不能为空!"})}))},deleteKubeDeployList:function(e){var t=this,a=this;a.$confirm("此操作将永久删除该条数据, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){d(e).then((function(e){a.dialogFormVisible=!1,a.$notify({title:"Success",message:"Delete Successfully",type:"success",duration:2e3}),a.getKubeDeployList()})).catch((function(e){console.log(e)}))})).catch((function(){t.$message({type:"info",message:"已取消删除"})}))},updateK8SDeploy:function(){var e=this,t=this;t.k8sClusterData.replicas=parseInt(t.k8sClusterData.replicas),t.k8sClusterData.ports=parseInt(t.k8sClusterData.ports),t.k8sClusterData.deployment_name=t.k8sClusterData.app_name,t.$confirm("此操作将修改该条数据, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){m(e.k8sClusterData).then((function(e){t.dialogFormVisible=!1,t.$notify({title:"Success",message:"Update Successfully",type:"success",duration:2e3}),t.getKubeDeployList()})).catch((function(e){console.log(e)}))})).catch((function(){e.$message({type:"info",message:"已取消修改"})}))},handleUpdate:function(e){var t=this;this.k8sClusterData=Object.assign({},e),this.k8sClusterData.timestamp=new Date,this.dialogStatus="update",this.dialogFormVisible=!0,this.$nextTick((function(){t.$refs["dataForm"].clearValidate()}))},resetTemp:function(){this.k8sClusterData={app_name:"",deployment_name:"",env:"",cluster:"",namespace:"",project_name:"k8s",resources:"1c2g",replicas:1,image:"",deploy_env:"",ports:80,affinity:"string",ant_affinity:"string",volumeMounts:"string",volume:"string",image_pull_secrets:"",health_liven_ess:"/",health_readiness:"/"}},handleCreate:function(){this.resetTemp(),this.dialogStatus="create",this.dialogFormVisible=!0}}},f=g,h=a("2877"),b=Object(h["a"])(f,s,l,!1,null,null,null);t["default"]=b.exports}}]);