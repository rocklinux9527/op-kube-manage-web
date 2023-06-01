<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.env"
        placeholder="请输入环境,模糊查询"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchBtn" >
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
           <el-button type="success" size="mini" @click="getKubeClusterCheck(row)">
            连接测试
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteKubeConfigList(row)">
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
        :model="k8sClusterData"
        label-position="left"
        label-width="80px"
        style="width: 500px; margin-left:30px;"
      >
        <el-form-item label="环境" prop="env">
          <el-input  v-model="k8sClusterData.env" placeholder="请输入环境" />
        </el-form-item>
        <el-form-item label="集群" prop="cluster_name">
          <el-input v-model="k8sClusterData.cluster_name" placeholder="请输入集群名称标识" clearable />
        </el-form-item>

        <el-form-item label="地址" prop="server_address">
          <el-input v-model="k8sClusterData.server_address" placeholder="请输入集群Api-server地址" clearable />
        </el-form-item>

        <el-form-item label="CA" prop="ca_data">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}"  v-model="k8sClusterData.ca_data" placeholder="请输入集群ca" clearable />
        </el-form-item>

        <el-form-item label="证书" prop="client_crt_data">
          <el-input  type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="k8sClusterData.client_crt_data" placeholder="请输入客户端证书" clearable />
        </el-form-item>
            <el-form-item label="私钥" prop="client_key_data">
          <el-input  type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="k8sClusterData.client_key_data" placeholder="请输入客户端私钥" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?postKubeConfigList() : updateK8Scluster()">
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
import {get_kube_envList,get_kube_cluserList,get_kube_configList,get_k8s_kube_cluster_check,post_kube_configList,put_kube_configList,delete_kube_configList } from '@/api/kube-config'

export default {
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
      importanceOptions: [1, 2, 3],
      showReviewer: false,
      k8sClusterData: {
        env: '',
        cluster_name: '',
        server_address: '',
        ca_data: '',
        client_crt_data: '',
        client_key_data: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Add'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
      env: [{ required: true, message: '环境不能为空', trigger: 'blur' }],
      cluster_name: [{ required: true, message: '集群名称不能为空', trigger: 'blur' }],
      server_address: [{ required: true, message: 'Api-server 地址不能为空', trigger: 'blur' }],
      ca_data: [{ required: true, message: 'CA 不能为空', trigger: 'blur' }],
      client_crt_data: [{ required: true, message: '证书不能为空', trigger: 'blur' }],
      client_key_data: [{ required: true, message: '私钥不能为空', trigger: 'blur' }],
    },
      downloadLoading: false  
    }
  },
  created() {
    this.getKubeConfigList()
  },
  methods: {
     searchBtn() {
      this.listQuery.page = 1;
       get_kube_configList(this.listQuery).then(response => {
        this.columns = response.columns
        this.testData = response.data
        this.kube_total = response.total
        this.listLoading = false
      })
    },
    closeDialogfun() {
      this.dialogCicdFormVisible = false
    },
    handleSizeChange: function(val) {
     this.listQuery.page_size = val
      this.getKubeConfigList()
    },
    handleCurrentChange: function(val) {
      this.listQuery.page = val
      this.getKubeConfigList()
    },
    getKubeConfigList() {
      get_kube_configList(this.listQuery).then(response => {
        this.columns = response.columns
        this.testData = response.data
        this.kube_total = response.total
        this.listLoading = false
      })
    },
    getKubeClusterCheck(row) {
    get_k8s_kube_cluster_check(row).then(response => {
      console.log(response)
      this.testData = response.data
      if (response.code === 20000) {
        this.$message.success('集群链接成功')
      }
      this.getKubeConfigList()
    }).catch(error => {
      if (error.response && error.response.code === 50000) {
        this.errorMessage = error.response.data.message
        this.$message.error(this.errorMessage)
      }
      this.getKubeConfigList()
    })
  },
    handleFilter() {
      this.listQuery.page = 1
      this.getKubeConfigList()
    },
   postKubeConfigList() {
    this.$refs.dataForm.validate((valid) => {
      if (valid) {
        post_kube_configList(this.k8sClusterData).then(response => {
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Created Successfully',
            type: 'success',
            duration: 2000
          })
          this.getKubeConfigList()
        })
      } else {
        this.$notify.error({
          title: 'Error',
          message: '请填写完整的表单信息,不能为空!'
        })
      }
    })
    },
    deleteKubeConfigList(row) {
      var _this51 = this
      _this51.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=> {
        delete_kube_configList(row).then(response =>{
          _this51.dialogFormVisible = false
          _this51.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          }),
          _this51.getKubeConfigList()
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
    updateK8Scluster() {
      var _this52 = this
      _this52.$confirm('此操作将修改该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        put_kube_configList(this.k8sClusterData).then(function(response) {
          _this52.dialogFormVisible = false
          _this52.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
          _this52.getKubeConfigList()
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
      console.log(row)
      this.k8sClusterData = Object.assign({}, row) // copy obj
      this.k8sClusterData.timestamp = new Date()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.k8sClusterData = {
        env: '',
        cluster_name: '',
        server_address: '',
        ca_data: '',
        client_crt_data: '',
        client_key_data: ''
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
