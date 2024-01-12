<template>
  <div class="app-container">
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
      <!-- Include your el-table-column here -->
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
        class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="warning" size="mini" @click="downloadFile(row)">下载</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
          <el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDatele(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "DataTable",
  props: {
    myRow: {},
    getTempleLIst: {
      type: Function,
      default: () => {},
    },
  },
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
    };
  },
  methods: {
    created() {
      console.log("进入table组件了");
      getTempleList();
    },
    downloadFile(row) {
      // Emit the titleChanged event to the parent component
      this.$emit("titleChanged", "子向父组件传值");
    },
    handleUpdate(row) {
      // Emit the titleChanged event to the parent component
      this.$emit("titleChanged", "子向父组件传值");
    },
    handleDatele(row) {
      // Emit the titleChanged event to the parent component
      this.$emit("titleChanged", "子向父组件传值");
    },
  },
};
</script>
