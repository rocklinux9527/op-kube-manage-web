<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="k8sClusterData.env" placeholder="请选择环境" clearable class="filter-item" style="width: 200px">
        <el-option
          v-for="item in envList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
     <el-select v-model="k8sClusterData.cluster" placeholder="请选择集群名称标识" @change="getnsList()" clearable class="filter-item" style="width: 200px">
        <el-option
          v-for="item in ClusterList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>   
      <el-select v-model="k8sClusterData.namespace" placeholder="请选择ns标识" clearable class="filter-item" style="width: 250px">
        <el-option
          v-for="item in nsList"
          :key="item"
          :label="item"
          :value="item"
        />
        </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search"  @click="searchBtn">
        查询
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
      <el-table-column label="操作"  type="expand" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="danger" size="mini" @click="restartK8SPod(row)">
            删除
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            更新
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <br >
    
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
        <el-form-item label="集群" prop="cluster">
          <el-select v-model="k8sClusterData.cluster" placeholder="请选择集群名称标识" @change="getnsList()"  clearable class="filter-item" style="width: 420px">
        <el-option
          v-for="item in ClusterList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>  
        </el-form-item>

        <el-form-item label="NS" prop="namespace">
          <el-select v-model="k8sClusterData.namespace" placeholder="请选择ns标识" clearable class="filter-item" style="width: 420px">
        <el-option
          v-for="item in nsList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>  
        </el-form-item>
         <el-form-item label="Pod名称" prop="pod_name">
          <el-input v-model="k8sClusterData.pod_name" :disabled="formMode === 'update'" placeholder="请输入Pod标识" clearable />
        </el-form-item>
        <el-form-item label="Pod端口" prop="ports" :rules="[{ validator: validatekubePort, trigger: 'blur' }]">
          <el-input v-model="k8sClusterData.ports" :disabled="formMode === 'update'" clearable />
       </el-form-item>
         <el-form-item label="镜像" prop="image">
          <el-input v-model="k8sClusterData.image" placeholder="请输入镜像地址" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?postKubePodList() : updateK8SPod()">
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
import {get_kube_envList,get_kube_cluserList,get_kube_sys_ns_all,get_kube_pod_list,get_kube_mock_pod_list,post_kube_pod_list,put_kube_pod_list,delete_kube_pod_list,post_kube_pod_restart} from '@/api/kube-pods'

export default {
  data() {
    return {
      formMode: 'create',
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
        cluster: '',
        namespace:'',
        pod_name: '',
        ports: '',
        image: ''
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
      pod_name: [{ required: true, message: '容器名称不能为空', trigger: 'blur' }],
      image: [{ required: true, message: '容器名称不能为空', trigger: 'blur' }],
      ports: [{ required: true, message: '容器名称不能为空', trigger: 'blur' }],
      env: [{ required: true, message: '环境不能为空', trigger: 'blur' }],
      namespace: [{ required: true, message: '命名空间名称不能为空', trigger: 'blur' }],
      container_image: [{ required: true, message: '应用镜像地址不能为空', trigger: 'blur' }]
    },
      downloadLoading: false  
    }
  },
  created() {
    this.getenvList(),
    this.getClusterList(),
    this.getKubePodList()
  },
  methods: {
     searchBtn() {
      this.listQuery.page = 1,
      this.getKubSysPodList()
    },
    closeDialogfun() {
      this.dialogCicdFormVisible = false
    },
    handleSizeChange: function(val) {
     this.listQuery.page_size = val
    },
    handleCurrentChange: function(val) {
      this.listQuery.page = val
    },
    handleCloseDialog(){
    this.dialogFormVisible = false,
    this.formMode = 'create'
    },
    validatekubePort(rule, value, callback) {
    const ports = parseInt(value, 10);
    if (isNaN(ports)) {
      callback(new Error('请输入数字'));
    } else if (ports > 65535) {
      callback(new Error('端口号不能大于65535!'));
    } else {
      callback();
    }
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
      get_kube_sys_ns_all(this.k8sClusterData).then((response) => {
        var data = response.data
        if (data){
          data.forEach((data) => {
           this.nsList.push(data)
        })
        }
      })
    },
    getKubePodList() {
      get_kube_mock_pod_list(this.listQuery).then(response => {
        this.columns = response.columns
        this.testData = response.data
        this.kube_total = response.total
        this.listLoading = false
      })
    },
    getKubSysPodList() { 
      get_kube_pod_list(this.k8sClusterData).then(response => {
        this.columns = response.columns
        this.testData = response.data
        this.kube_total = response.total
        this.listLoading = false
      })
    },
    getKubeRestartPodList(row) { 
      get_kube_pod_list(row).then(response => {
        this.columns = response.columns
        this.testData = response.data
        this.kube_total = response.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
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
      callback(new Error('端口号不能大于65535!'));
    } else {
      callback();
    }
  },
   postKubePodList() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          post_kube_pod_list(this.k8sClusterData).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.getKubePodList()
          })
        } else {
          this.$notify.error({
            title: 'Error',
            message: '请填写完整的表单信息,不能为空!'
          })
        }
      })
    },
   restartK8SPod(row) {
  var _this53 = this;
  _this53.$confirm('此操作将影响服务稳定性，是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    post_kube_pod_restart(row).then(function(response) {
      console.log("restrt", response);
      _this53.dialogFormVisible = false;
      _this53.$notify({
        title: 'Success',
        message: 'Restart Pod Successfully',
        type: 'success',
        duration: 2000
      });
    }).catch(function(error) {
      console.log(error);
    });
  }).catch(() => {
    this.$message({
      type: 'info',
      message: '已取消重启'
    });
  });
   },
    deleteKubePodList(row) {
      var _this51 = this
      _this51.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=> {
        delete_kube_pod_list(row).then(response =>{
          _this51.dialogFormVisible = false
          _this51.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          }),
          _this51.getKubePodList()
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
    updateK8SPod() {
      var _this52 = this
      _this52.k8sClusterData.ports = parseInt(_this52.k8sClusterData.ports)
      _this52.$confirm('此操作将影响服务稳定性,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        put_kube_pod_list(this.k8sClusterData).then(function(response) {
          _this52.dialogFormVisible = false
          _this52.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
          _this52.getKubSysPodList()
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
      this.formMode = 'update';
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.k8sClusterData = {
        env: '',
        cluster: '',
        namespace:'',
        pod_name: '',
        ports: '',
        image: ''
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
