<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.svc_name"
        placeholder="请输入Service 模糊查询"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchBtn">
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
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteKubeServiceList(row)">
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
         <el-select v-model="k8sClusterData.env" placeholder="请选择环境" clearable class="filter-item" style="width: 420px">
        <el-option
          v-for="item in envList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      </el-form-item>
      
        <el-form-item label="集群" prop="cluster_name">
          <el-select v-model="k8sClusterData.cluster_name" placeholder="请选择集群名称标识" clearable class="filter-item" style="width: 420px">
        <el-option
          v-for="item in ClusterList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>  
      </el-form-item>

        <el-form-item label="NS" prop="namespace">
          <el-select v-model="k8sClusterData.namespace" placeholder="请输入集群namespace" clearable class="filter-item" style="width: 420px">
        <el-option
          v-for="item in nsList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>  
      </el-form-item>
        <el-form-item label="标签" prop="selector_labels">
          <el-input v-model="k8sClusterData.selector_labels" placeholder="请输入关联标签selector-labels" clearable />
        </el-form-item>
         <el-form-item label="SVC名称" prop="svc_name">
          <el-input v-model="k8sClusterData.svc_name" placeholder="请输入SVC名称"  clearable />
        </el-form-item>

        <el-form-item label="SVC端口" prop="svc_port" :rules="[{ validator: validatekubePort, trigger: 'blur' }]"> 
          <el-input v-model="k8sClusterData.svc_port" placeholder="请输入服务port"  clearable />
        </el-form-item>

    <el-form-item label="SVC类型" prop="svc_type">
        <el-radio v-model="k8sClusterData.svc_type" label="ClusterIP" border size="small">ClusterIP</el-radio>
        <el-radio v-model="k8sClusterData.svc_type" label="NodePort" border size="small">NodePort</el-radio>
        <el-radio v-model="k8sClusterData.svc_type" label="LoadBalancer" border size="small" disabled>LoadBalancer</el-radio>
      </el-form-item>
     <el-form-item label="应用端口" prop="target_port" :rules="[{ validator: validatekubePort, trigger: 'blur' }]"> 
          <el-input v-model="k8sClusterData.target_port" placeholder="请输入后端端口" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?postKubeServiceList() : updateK8SService()">
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
import {get_kube_envList,get_kube_cluserList,get_kube_nsList,get_kube_service_list,post_kube_service_list,put_kube_service_list,delete_kube_service_list } from '@/api/kube-service'

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
      nsList: [],
      importanceOptions: [1, 2, 3],
      showReviewer: false,
      k8sClusterData: {
        env: '',
        cluster_name: '',
        namespace: '',
        svc_name: '',
        selector_labels: '',
        svc_port:80,
        svc_type: 'ClusterIP',
        target_port: 80
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
      app_name: [{ required: true, message: '应用名称不能为空', trigger: 'blur' }],
      env: [{ required: true, message: '环境不能为空', trigger: 'blur' }],
      cluster_name: [{ required: true, message: '集群不能为空', trigger: 'blur' }],
      namespace: [{ required: true, message: '命名空间名称不能为空', trigger: 'blur' }],
      svc_port: [{ required: true, message: '命名空间名称不能为空', trigger: 'blur' }],
      svc_name: [{ required: true, message: 'SVC名称不能为空', trigger: 'blur' }],
      selector_labels: [{ required: true, message: 'SVC名称不能为空', trigger: 'blur' }],
      svc_type: [{ required: true, message: 'SVC类型不能为空', trigger: 'blur' }],
      target_port: [{ required: true, message: '应用端口不能为空', trigger: 'blur' }],
    },
      downloadLoading: false  
    }
  },
  created() {
    this.getKubeServiceList(),
    this.getenvList(),
    this.getClusterList(),
    this.getnsList()
  },
  methods: {
     searchBtn() {
      this.listQuery.page = 1;
      get_kube_service_list(this.listQuery).then(response => {
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
      this.getKubeServiceList()
    },
    handleCurrentChange: function(val) {
      this.listQuery.page = val
      this.getKubeServiceList()
    },
     getenvList() {
       get_kube_envList(this.listQuery).then((response) => {
        var data = response.data
        if (data){
          data.forEach((data) => {
          this.envList.push(data)
        })
      }
      })
    },
    getClusterList() {
      get_kube_cluserList(this.listQuery).then((response) => {
        var data = response.data
         if (data){
          data.forEach((data) => {
          this.ClusterList.push(data)
         })
        }
      })
    },
    getnsList(){
      get_kube_nsList(this.listQuery).then((response) => {
        var data = response.data
        if (data){
          data.forEach((data) => {
           this.nsList.push(data)
        })
        }
      })
    },
    getKubeServiceList() {
        get_kube_service_list(this.listQuery).then(response => {
        this.columns = response.columns
        this.testData = response.data
        this.kube_total = response.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getKubeServiceList()
    },
    validateReplicas(rule, value, callback) {
    const replicas = parseInt(value, 10);
    if (isNaN(replicas)) {
      callback(new Error('请输入数字'));
    } else if (replicas > 10) {
      callback(new Error('单个应用副本数不能大于10'));
    } else {
      callback();
    }
  },
  validatekubePort(rule, value, callback) {
    const ports = parseInt(value, 10);
    if (isNaN(ports)) {
      callback(new Error('请输入数字'));
    } else if (ports > 65535) {
      callback(new Error('端口号不能大于65535'));
    } else {
      callback();
    }
  },
   postKubeServiceList() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          post_kube_service_list(this.k8sClusterData).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.getKubeServiceList()
          })
        } else {
          this.$notify.error({
            title: 'Error',
            message: '请填写完整的表单信息,不能为空!'
          })
        }
      })
    },
    deleteKubeServiceList(row) {
      var _this51 = this
      _this51.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=> {
        delete_kube_service_list(row).then(response =>{
          _this51.dialogFormVisible = false
          _this51.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          }),
          _this51.getKubeServiceList()
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
    updateK8SService() {
      var _this52 = this
      _this52.$confirm('此操作将修改该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        put_kube_service_list(this.k8sClusterData).then(function(response) {
          _this52.dialogFormVisible = false
          _this52.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
          _this52.getKubeServiceList()
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
        namespace: '',
        svc_name: '',
        selector_labels: '',
        svc_port:80,
        svc_type: 'ClusterIP',
        target_port: 80
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
