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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
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
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
           <el-button type="warning" size="mini" @click="downloadFile(row)">
            下载  
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteTemple(row)">
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="postFrom"
        label-position="left"
        label-width="80px"
        style="width: 500px; margin-left:30px;"
      >

       <el-form-item label="名称:" prop="name" >
        <el-input v-model="postFrom.name"> </el-input>
      </el-form-item>
       <el-form-item label="类型:" prop="t_type" >
        <el-select placeholder="请选择" v-model="postFrom.t_type" clearable class="filter-item"  style="width: 420px">
          <el-option
            :key="item.key"
            :label="item.key"
            :value="item.value"
            v-for="item in typeArray">
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-select v-model="postFrom.language" placeholder="请选择" clearable class="filter-item" style="width: 420px">
         <el-option
            :key="item"
            :label="item"
            :value="item"
            v-for="item in languageArray">
          </el-option>
      </el-select>  
      </el-form-item> 
       <el-form-item label="内容:" prop="content">
       <codemirror :options="cmOptions" v-model="postFrom.content" ref="contentEditor"> </codemirror>
      </el-form-item>
    
     <el-form-item label="备注" prop="remark"> 
          <el-input type="textarea" v-model="postFrom.remark"></el-input>
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

<script>

import { create_temples_list,download_temples_list, get_temples_list, update_temples_list, delete_temples_list } from '@/api/temples'
import {codemirror} from 'vue-codemirror'

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
      codemirror
    },
  data() {
    return {
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
          content: '',
          t_type: '',
          language: 'shell',
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
      language: [{ required: true, message: '语言不能为空', trigger: 'blur' }],
      t_type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
      remark: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
    },
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
      {value: '8', key: 'shell conf'},
      {value: '9', key: 'python conf'},
      {value: '10', key: 'go conf'},
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
      downloadLoading: false  
    }
  },
  created() {
    this.getTempleLIst()
  },
  methods: {
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
    downloadFile(row) {
    {
      const url = `http://127.0.0.1:8888/api/template/download/?name=${encodeURIComponent(row.name)}&language=${encodeURIComponent(row.language)}`;
      window.open(url, '_blank');
     } 
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
          type: '',
          language: 'shell',
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
