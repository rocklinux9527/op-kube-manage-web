(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c952b"],{"593d":function(t,e,a){"use strict";a.r(e);var s,l=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"app-container"},[a("div",{staticClass:"filter-container"},[a("el-select",{staticClass:"filter-item",staticStyle:{width:"200px"},attrs:{placeholder:"请选择环境",clearable:""},model:{value:t.k8sClusterData.env,callback:function(e){t.$set(t.k8sClusterData,"env",e)},expression:"k8sClusterData.env"}},t._l(t.envList,(function(t){return a("el-option",{key:t,attrs:{label:t,value:t}})})),1),t._v(" "),a("el-select",{staticClass:"filter-item",staticStyle:{width:"200px"},attrs:{placeholder:"请选择集群名称标识",clearable:""},on:{change:function(e){return t.getnsList()}},model:{value:t.k8sClusterData.cluster,callback:function(e){t.$set(t.k8sClusterData,"cluster",e)},expression:"k8sClusterData.cluster"}},t._l(t.ClusterList,(function(t){return a("el-option",{key:t,attrs:{label:t,value:t}})})),1),t._v(" "),a("el-select",{staticClass:"filter-item",staticStyle:{width:"250px"},attrs:{placeholder:"请选择ns标识",clearable:""},model:{value:t.k8sClusterData.namespace,callback:function(e){t.$set(t.k8sClusterData,"namespace",e)},expression:"k8sClusterData.namespace"}},t._l(t.nsList,(function(t){return a("el-option",{key:t,attrs:{label:t,value:t}})})),1),t._v(" "),a("el-button",{staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-search"},on:{click:t.searchBtn}},[t._v("\n      查询\n    ")]),t._v(" "),a("el-button",{staticClass:"filter-item",staticStyle:{"margin-left":"10px"},attrs:{type:"primary",icon:"el-icon-edit"},on:{click:t.handleCreate}},[t._v("\n      新建\n    ")])],1),t._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],key:t.tableKey,staticStyle:{width:"100%"},attrs:{data:t.testData,border:"","highlight-current-row":""}},[t._l(t.columns,(function(t){return a("el-table-column",{attrs:{"show-overflow-tooltip":"",label:t.alias,prop:t.name,align:"center"}})})),t._v(" "),a("el-table-column",{attrs:{label:"操作",type:"expand",align:"center","class-name":"small-padding fixed-width"},scopedSlots:t._u([{key:"default",fn:function(e){var s=e.row;return[a("el-button",{attrs:{type:"danger",size:"mini"},on:{click:function(e){return t.restartK8SPod(s)}}},[t._v("\n          删除\n        ")]),t._v(" "),a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(e){return t.handleUpdate(s)}}},[t._v("\n          更新\n        ")])]}}])})],2),t._v(" "),a("br"),t._v(" "),a("el-dialog",{attrs:{title:t.textMap[t.dialogStatus],visible:t.dialogFormVisible},on:{"update:visible":function(e){t.dialogFormVisible=e}}},[a("el-form",{ref:"dataForm",staticStyle:{width:"500px","margin-left":"30px"},attrs:{rules:t.rules,model:t.k8sClusterData,"label-position":"left","label-width":"80px"}},[a("el-form-item",{attrs:{label:"环境",prop:"env"}},[a("el-select",{staticClass:"filter-item",staticStyle:{width:"420px"},attrs:{placeholder:"请选择环境",clearable:""},model:{value:t.k8sClusterData.env,callback:function(e){t.$set(t.k8sClusterData,"env",e)},expression:"k8sClusterData.env"}},t._l(t.envList,(function(t){return a("el-option",{key:t,attrs:{label:t,value:t}})})),1)],1),t._v(" "),a("el-form-item",{attrs:{label:"集群",prop:"cluster"}},[a("el-select",{staticClass:"filter-item",staticStyle:{width:"420px"},attrs:{placeholder:"请选择集群名称标识",clearable:""},on:{change:function(e){return t.getnsList()}},model:{value:t.k8sClusterData.cluster,callback:function(e){t.$set(t.k8sClusterData,"cluster",e)},expression:"k8sClusterData.cluster"}},t._l(t.ClusterList,(function(t){return a("el-option",{key:t,attrs:{label:t,value:t}})})),1)],1),t._v(" "),a("el-form-item",{attrs:{label:"NS",prop:"namespace"}},[a("el-select",{staticClass:"filter-item",staticStyle:{width:"420px"},attrs:{placeholder:"请选择ns标识",clearable:""},model:{value:t.k8sClusterData.namespace,callback:function(e){t.$set(t.k8sClusterData,"namespace",e)},expression:"k8sClusterData.namespace"}},t._l(t.nsList,(function(t){return a("el-option",{key:t,attrs:{label:t,value:t}})})),1)],1),t._v(" "),a("el-form-item",{attrs:{label:"Pod名称",prop:"pod_name"}},[a("el-input",{attrs:{disabled:"update"===t.formMode,placeholder:"请输入Pod标识",clearable:""},model:{value:t.k8sClusterData.pod_name,callback:function(e){t.$set(t.k8sClusterData,"pod_name",e)},expression:"k8sClusterData.pod_name"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"Pod端口",prop:"ports",rules:[{validator:t.validatekubePort,trigger:"blur"}]}},[a("el-input",{attrs:{disabled:"update"===t.formMode,clearable:""},model:{value:t.k8sClusterData.ports,callback:function(e){t.$set(t.k8sClusterData,"ports",e)},expression:"k8sClusterData.ports"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"镜像",prop:"image"}},[a("el-input",{attrs:{placeholder:"请输入镜像地址",clearable:""},model:{value:t.k8sClusterData.image,callback:function(e){t.$set(t.k8sClusterData,"image",e)},expression:"k8sClusterData.image"}})],1)],1),t._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:t.handleCloseDialog}},[t._v("\n        取消\n      ")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:function(e){"create"===t.dialogStatus?t.postKubePodList():t.updateK8SPod()}}},[t._v("\n        提交\n      ")])],1)],1),t._v(" "),a("el-dialog",{attrs:{visible:t.dialogPvVisible,title:"Reading statistics"},on:{"update:visible":function(e){t.dialogPvVisible=e}}},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.pvData,border:"",fit:"","highlight-current-row":""}},[a("el-table-column",{attrs:{prop:"key",label:"Channel"}}),t._v(" "),a("el-table-column",{attrs:{prop:"pv",label:"Pv"}})],1),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.dialogPvVisible=!1}}},[t._v("Confirm")])],1)],1)],1)},i=[],n=a("bd86"),r=(a("ac6a"),a("b775"));function o(t){return Object(r["a"])({url:"/api/v1/kube/env/list/",method:"get",params:t})}function u(t){return Object(r["a"])({url:"/api/v1/kube/cluster/List/",method:"get",params:t})}function c(t){return Object(r["a"])({url:"/api/v1/sys/k8s/ns/plan",method:"get",params:t})}function d(t){return Object(r["a"])({url:"/api/v1/kube/pod",method:"get",params:t})}function p(t){return Object(r["a"])({url:"/api/v1/kube/pod/mock",method:"get",params:t})}function f(t){return Object(r["a"])({url:"/api/v1/kube/pod/restart",method:"post",data:t})}function m(t){return Object(r["a"])({url:"/api/v1/kube/pod/",method:"post",data:t})}function b(t){return Object(r["a"])({url:"/api/v1/kube/pod",method:"put",data:t})}function g(t){return Object(r["a"])({url:"/api/v1/kube/pod",method:"delete",data:t})}var h={data:function(){return{formMode:"create",kube_total:0,clearValidate:"",hostTotal:0,currentPage:1,pageSize:5,testData:[],columns:[],tableKey:0,list:null,total:0,listLoading:!0,listQuery:{page:1,page_size:10},envList:[],nsList:[],importanceOptions:[1,2,3],showReviewer:!1,k8sClusterData:{env:"",cluster:"",namespace:"",pod_name:"",ports:"",image:""},ClusterList:[],dialogFormVisible:!1,dialogStatus:"",textMap:{update:"Edit",create:"Add"},dialogPvVisible:!1,pvData:[],rules:{pod_name:[{required:!0,message:"容器名称不能为空",trigger:"blur"}],image:[{required:!0,message:"容器名称不能为空",trigger:"blur"}],ports:[{required:!0,message:"容器名称不能为空",trigger:"blur"}],env:[{required:!0,message:"环境不能为空",trigger:"blur"}],namespace:[{required:!0,message:"命名空间名称不能为空",trigger:"blur"}],container_image:[{required:!0,message:"应用镜像地址不能为空",trigger:"blur"}]},downloadLoading:!1}},created:function(){this.getenvList(),this.getClusterList(),this.getKubePodList()},methods:(s={searchBtn:function(){this.listQuery.page=1,this.getKubSysPodList()},closeDialogfun:function(){this.dialogCicdFormVisible=!1},handleSizeChange:function(t){this.listQuery.page_size=t},handleCurrentChange:function(t){this.listQuery.page=t},handleCloseDialog:function(){this.dialogFormVisible=!1,this.formMode="create"},validatekubePort:function(t,e,a){var s=parseInt(e,10);isNaN(s)?a(new Error("请输入数字")):s>65535?a(new Error("端口号不能大于65535!")):a()},getenvList:function(){var t=this;o(this.listQuery).then((function(e){var a=e.data;a&&a.forEach((function(e){t.envList.push(e)}))}))},getClusterList:function(){var t=this;u(this.listQuery).then((function(e){var a=e.data;a&&a.forEach((function(e){t.ClusterList.push(e)}))}))},getnsList:function(){var t=this;c(this.k8sClusterData).then((function(e){var a=e.data;a&&a.forEach((function(e){t.nsList.push(e)}))}))},getKubePodList:function(){var t=this;p(this.listQuery).then((function(e){t.columns=e.columns,t.testData=e.data,t.kube_total=e.total,t.listLoading=!1}))},getKubSysPodList:function(){var t=this;d(this.k8sClusterData).then((function(e){t.columns=e.columns,t.testData=e.data,t.kube_total=e.total,t.listLoading=!1}))},getKubeRestartPodList:function(t){var e=this;d(t).then((function(t){e.columns=t.columns,e.testData=t.data,e.kube_total=t.total,e.listLoading=!1}))},handleFilter:function(){this.listQuery.page=1},validateReplicas:function(t,e,a){var s=parseInt(e,10);isNaN(s)?a(new Error("请输入数字")):s>10?a(new Error("单个应用副本数不能大于10")):a()}},Object(n["a"])(s,"validatekubePort",(function(t,e,a){var s=parseInt(e,10);isNaN(s)?a(new Error("请输入数字")):s>65535?a(new Error("端口号不能大于65535!")):a()})),Object(n["a"])(s,"postKubePodList",(function(){var t=this;this.$refs.dataForm.validate((function(e){e?m(t.k8sClusterData).then((function(e){t.dialogFormVisible=!1,t.$notify({title:"Success",message:"Created Successfully",type:"success",duration:2e3}),t.getKubePodList()})):t.$notify.error({title:"Error",message:"请填写完整的表单信息,不能为空!"})}))})),Object(n["a"])(s,"restartK8SPod",(function(t){var e=this,a=this;a.$confirm("此操作将影响服务稳定性，是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){f(t).then((function(t){console.log("restrt",t),a.dialogFormVisible=!1,a.$notify({title:"Success",message:"Restart Pod Successfully",type:"success",duration:2e3})})).catch((function(t){console.log(t)}))})).catch((function(){e.$message({type:"info",message:"已取消重启"})}))})),Object(n["a"])(s,"deleteKubePodList",(function(t){var e=this,a=this;a.$confirm("此操作将永久删除该条数据, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){g(t).then((function(t){a.dialogFormVisible=!1,a.$notify({title:"Success",message:"Delete Successfully",type:"success",duration:2e3}),a.getKubePodList()})).catch((function(t){console.log(t)}))})).catch((function(){e.$message({type:"info",message:"已取消删除"})}))})),Object(n["a"])(s,"updateK8SPod",(function(){var t=this,e=this;e.k8sClusterData.ports=parseInt(e.k8sClusterData.ports),e.$confirm("此操作将影响服务稳定性,是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){b(t.k8sClusterData).then((function(t){e.dialogFormVisible=!1,e.$notify({title:"Success",message:"Update Successfully",type:"success",duration:2e3}),e.getKubSysPodList()})).catch((function(t){console.log(t)}))})).catch((function(){t.$message({type:"info",message:"已取消修改"})}))})),Object(n["a"])(s,"handleUpdate",(function(t){var e=this;console.log(t),this.k8sClusterData=Object.assign({},t),this.k8sClusterData.timestamp=new Date,this.dialogStatus="update",this.formMode="update",this.dialogFormVisible=!0,this.$nextTick((function(){e.$refs["dataForm"].clearValidate()}))})),Object(n["a"])(s,"resetTemp",(function(){this.k8sClusterData={env:"",cluster:"",namespace:"",pod_name:"",ports:"",image:""}})),Object(n["a"])(s,"handleCreate",(function(){this.resetTemp(),this.dialogStatus="create",this.dialogFormVisible=!0})),s)},v=h,k=a("2877"),C=Object(k["a"])(v,l,i,!1,null,null,null);e["default"]=C.exports}}]);