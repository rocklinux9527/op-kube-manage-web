  <template>
    <div class="app-container">
      <div class="filter-container">
        <el-input
          v-model="listQuery.title"
          placeholder="请输入内容"
          style="width: 200px"
          class="filter-item"
        />
        <el-button class="filter-item" type="primary" icon="el-icon-search">
          搜索
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 650px"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >
          新建
        </el-button>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="testData"
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          show-overflow-tooltip
          v-for="item in columns"
          :label="item.alias"
          :prop="item.name"
          align="center"
        />

        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              修改
            </el-button>
            <el-button
              v-if="row.status != 'deleted'"
              size="mini"
              type="danger"
              @click="deleteTemple(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <br />
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
      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        width="45%"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="postFrom"
          label-position="left"
          label-width="65px"
          style="width: 450px; margin-left: 30px"
        >
          <el-form-item label="名称:" prop="name">
            <el-input v-model="postFrom.name"> </el-input>
          </el-form-item>

          <el-form-item label="描述" prop="used">
            <el-input type="input" v-model="postFrom.used"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false"> 取消 </el-button>
          <el-button
            type="primary"
            @click="dialogStatus === 'create' ? postTemple() : updateTemple()"
          >
            提交
          </el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
        <el-table
          :data="pvData"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column prop="key" label="Channel" />
          <el-table-column prop="pv" label="Pv" />
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogPvVisible = false"
            >Confirm</el-button
          >
        </span>
      </el-dialog>
    </div>
  </template>

  <script>
  import {
    create_app_temples_list,
    get_app_temples_list,
    update_app_temples_list,
    delete_app_temples_list,
  } from "@/api/app-temples";

  export default {
    data() {
      return {
        kube_total: 0,
        clearValidate: "",
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
          name: "",
          used: ""
        },
        ClusterList: [],
        dialogFormVisible: false,
        dialogStatus: "",
        textMap: {
          update: "Edit",
          create: "Add",
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
          used: [{ required: true, message: "类型不能为空", trigger: "blur" }],
        },
        downloadLoading: false,
      };
    },
    created() {
      this.getTempleLIst();
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
        this.dialogCicdFormVisible = false;
      },
      handleSizeChange: function (val) {
        this.listQuery.page_size = val;
        this.getTempleLIst();
      },
      handleCurrentChange: function (val) {
        this.listQuery.page = val;
        this.getTempleLIst();
      },
      getTempleLIst() {
        get_app_temples_list(this.listQuery).then((response) => {
          this.columns = response.columns;
          this.testData = response.data;
          this.kube_total = response.total;
          this.listLoading = false;
        });
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getTempleLIst();
      },
      postTemple() {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            create_app_temples_list(this.postFrom).then((response) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "Success",
                message: "Created Successfully",
                type: "success",
                duration: 2000,
              });
              this.getTempleLIst();
            });
          } else {
            this.$notify.error({
              title: "Error",
              message: "请填写完整的表单信息,不能为空!",
            });
          }
        });
      },
      deleteTemple(row) {
        var _this51 = this;
        _this51
          .$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            delete_app_temples_list(row)
              .then((response) => {
                _this51.dialogFormVisible = false;
                _this51.$notify({
                  title: "Success",
                  message: "Delete Successfully",
                  type: "success",
                  duration: 2000,
                }),
                  _this51.getTempleLIst();
              })
              .catch(function (error) {
                console.log(error);
              });
            /* this.$message({
              type: 'success',
              message: '删除成功!'
            });*/
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      },
      updateTemple() {
        var _this52 = this;
        _this52
          .$confirm("此操作将修改该条数据, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            update_app_temples_list(this.postFrom)
              .then(function (response) {
                _this52.dialogFormVisible = false;
                _this52.$notify({
                  title: "Success",
                  message: "Update Successfully",
                  type: "success",
                  duration: 2000,
                });
                _this52.getTempleLIst();
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消修改",
            });
          });
      },
      handleUpdate(row) {
        this.postFrom = Object.assign({}, row); // copy obj
        this.postFrom.timestamp = new Date();
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      },
      resetTemp() {
        this.postFrom = {
          name: "",
          used: ""
        };
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
      },
    },
  };
  </script>
