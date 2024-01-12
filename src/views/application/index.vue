<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="请输入内容"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 650px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新建
      </el-button>

    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="testData"
      border
      highlight-current-row
      style="width: 100%;"
    >
    <el-table-column show-overflow-tooltip	v-for="item in columns" :label="item.alias" :prop="item.name" align="center"/>

    <el-table-column label="操作(配置管理)" align="center" width="250px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)" class="button-with-margin">
            模版
          </el-button>
     <router-link to="/components/envs-form" class="button-with-margin"> 
        <el-button class="filter-item"  size="mini" type="warning" >
           容器
        </el-button>
      </router-link> 
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteTemple(row)" class="button-with-margin">
            删除
          </el-button>
        </template>
    </el-table-column>

    </el-table>
    <br >
    <div class="block">
      <span class="demonstration" />
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[1, 5, 10, 100]"
        :page-size="listQuery.page_zie"
        layout="total, sizes, prev, pager, next, jumper"
        :total="kube_total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="45%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="postFrom"
        label-position="left"
        label-width="65px"
        style="width: 450px; margin-left:30px;"
      >
       <el-form-item label="名称:" prop="name" >
        <el-input v-model="postFrom.name"> </el-input>
      </el-form-item>

      <el-form-item label="Git:" prop="git"> 
          <el-input type="input" v-model="postFrom.git"></el-input>
      </el-form-item>

      <el-form-item label="模版:" prop="temple" >
        <el-select v-model="postFrom.temple"  placeholder="请选择模版" clearable class="filter-item" style="width: 385px" >
         <el-option 
            :key="item"
            :label="item"
            :value="item"
            v-for="item in languageArray">
          </el-option>
      </el-select> 
      </el-form-item> 
     
      <el-form-item label="用途:" prop="used" >
        <el-input v-model="postFrom.used"> </el-input>
      </el-form-item>

      <el-alert  title="测试环境" type="success" :closable="false"> </el-alert>
      <hr >
       <el-form-item label="NS:" prop="cluster" >
        <el-select placeholder="请选择NS" multiple v-model="postFrom.t_type"  clearable class="filter-item"  style="width: 385px">
          <el-option
            :key="item.key"
            :label="item.key"
            :value="item.value"
            v-for="item in typeArray">
          </el-option>
        </el-select>
      </el-form-item>

      <el-alert  title="预发环境" type="warning" :closable="false"> </el-alert>
      <hr >
       <el-form-item label="NS:" prop="cluster" >
        <el-select placeholder="请选择集群" v-model="postFrom.t_type"  clearable class="filter-item"  style="width: 385px">
          <el-option
            :key="item.key"
            :label="item.key"
            :value="item.value"
            v-for="item in typeArray">
          </el-option>
        </el-select>
      </el-form-item>

      <el-alert  title="生产环境" type="error" :closable="false" > </el-alert>
      <hr >
       <el-form-item label="NS:" prop="cluster" >
        <el-select placeholder="请选择集群" v-model="postFrom.t_type"  clearable class="filter-item"  style="width: 385px">
          <el-option
            :key="item.key"
            :label="item.key"
            :value="item.value"
            v-for="item in typeArray">
          </el-option>
        </el-select>
      </el-form-item>
      </el-form>
      

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?postTemple() : updateTemple()">
          提交
        </el-button>
      </div>

    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style >
.button-with-margin {
  margin-right: 10px;
}
</style>


<script>

import { create_temples_list,download_temples_list, get_temples_list, update_temples_list, delete_temples_list } from '@/api/temples'
import {codemirror} from 'vue-codemirror'


// import DataTable from "./el-table.vue"

import EenvsTable from "./envs_tabs.vue"

import "codemirror/lib/codemirror.css";
// 主题
import "codemirror/theme/3024-day.css"; // 引入主题样式，根据设置的theme的主题引入
import "codemirror/theme/monokai.css";
import 'codemirror/theme/rubyblue.css';
// html代码高亮
import "codemirror/mode/htmlmixed/htmlmixed.js";
// 语言模式
import 'codemirror/mode/javascript/javascript.js';
import "codemirror/mode/python/python.js";
import "codemirror/mode/groovy/groovy.js";
import "codemirror/mode/nginx/nginx.js";
import "codemirror/mode/shell/shell.js";
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/yaml/yaml.js";
import "codemirror/mode/dockerfile/dockerfile.js"


export default {
   components: {
      codemirror,
      EenvsTable,
    },
  data() {
    return {
      myRowData: {
          someProperty: "Hello from parent!",
      },  
      kube_total:0,
      clearValidate:'',
      hostTotal: 0,
      currentPage: 1,
      pageSize: 5,
      testData: [],
      columns: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
      },
      envList: [],
      nsList: [],
      importanceOptions: [1, 2, 3],
      showReviewer: false,
      postFrom: {
          name: '',
          git: '',
          t_type: '',
          language: '',
          used: '',
          remark: ''
      },
      ClusterList: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Add'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
      name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
      git: [{ required: true, message: 'git地址不能为空', trigger: 'blur' }],
      temple: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
      remark: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
      used: [{ required: true, message: '用途不能为空', trigger: 'blur' }],
    },
    languageArray: [
          ''
        ],
    typeArray: [  
      {value: '6', key: 'deployment'},
    ],
    cmOptions: {
      // <!-- 以什么格式进行高亮 -->
      mode: "yaml",
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
      downloadLoading: false  
    }
  },
  created() {
    this.getTempleLIst()
  },
  methods: {
     handleTitleChanged(value) {
      // 处理从子组件传递的值
      console.log(value);
      console.log("Received from child:", value);
    },
     searchBtn() {
      this.listQuery.page = 1;
      this.getList();
    },
    closeDialogfun() {
      this.dialogCicdFormVisible = false
    },
    handleSizeChange: function(val) {
     this.listQuery.page_size = val
      this.getTempleLIst()
    },
    handleCurrentChange: function(val) {
      this.listQuery.page = val
      this.getTempleLIst()
    },
    getTempleLIst() {
        get_temples_list(this.listQuery).then(response => {
        this.columns = response.columns
        this.testData = response.data
        this.kube_total = response.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getTempleLIst()
    },
   postTemple() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          create_temples_list(this.postFrom).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.getTempleLIst()
          })
        } else {
          this.$notify.error({
            title: 'Error',
            message: '请填写完整的表单信息,不能为空!'
          })
        }
      })
    },
    deleteTemple(row) {
      var _this51 = this
      _this51.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=> {
        delete_temples_list(row).then(response =>{
          _this51.dialogFormVisible = false
          _this51.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          }),
          _this51.getTempleLIst()
        }).catch(function(error) {
          console.log(error)
        })
        /* this.$message({
            type: 'success',
            message: '删除成功!'
          });*/
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    updateTemple() {
      var _this52 = this
      _this52.$confirm('此操作将修改该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        update_temples_list(this.postFrom).then(function(response) {
          _this52.dialogFormVisible = false
          _this52.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
          _this52.getTempleLIst()
        }).catch(function(error) {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    },
      handleUpdate(row) {
      this.postFrom = Object.assign({}, row) // copy obj
      this.postFrom.timestamp = new Date()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.postFrom = {
          name: '',
          content: '',
          t_type: '',
          used: '',
          language: '',
          remark: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    }
  }
}
</script>
