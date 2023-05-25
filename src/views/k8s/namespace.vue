<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.ns_name"
        placeholder="请输入namespace模糊查询"
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

        <el-form-item label="NS" prop="ns_name">
          <el-input v-model="k8sClusterData.ns_name" placeholder="请输入namespace命名空间" clearable />
        </el-form-item>

        <el-form-item label="Used" prop="used">
          <el-input v-model="k8sClusterData.used" placeholder="请输入namespace用途或者说明" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?postKubeNameSpaceList() : updateK8Snamespaces()">
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
import {get_kube_envList,get_kube_cluserList,get_kube_namespaceList,post_kube_namespaceList } from '@/api/kube-ns'

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
        ns_name: '',
        used: ''
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
      ns_name: [{ required: true, message: '命名空间名称不能为空', trigger: 'blur' }],
      used: [{ required: true, message: '命名空间用途不能为空', trigger: 'blur' }],
    },
      downloadLoading: false  
    }
  },
  created() {
    this.getKubeNameSpaceList(),
    this.getenvList(),
    this.getClusterList()
  },
  methods: {
     searchBtn() {
      this.listQuery.page = 1;
       get_kube_namespaceList(this.listQuery).then(response => {
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
      this.getKubeNameSpaceList()
    },
    handleCurrentChange: function(val) {
      this.listQuery.page = val
      this.getKubeNameSpaceList()
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

    getKubeNameSpaceList() {
        get_kube_namespaceList(this.listQuery).then(response => {
        this.columns = response.columns
        this.testData = response.data
        this.kube_total = response.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getKubeNameSpaceList()
    },
   postKubeNameSpaceList() {
    this.$refs.dataForm.validate((valid) => {
      if (valid) {
        post_kube_namespaceList(this.k8sClusterData).then(response => {
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: 'Created Successfully',
            type: 'success',
            duration: 2000
          })
          this.getKubeNameSpaceList()
        })
      } else {
        this.$notify.error({
          title: 'Error',
          message: '请填写完整的表单信息,不能为空!'
        })
      }
    })
    },

    resetTemp() {
      this.k8sClusterData = {
        env: '',
        cluster_name: '',
        ns_name: '',
        used: ''
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
