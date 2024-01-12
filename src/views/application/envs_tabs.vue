<template>
  <div>
    <div align="center" width="400px" style="margin-top: 50px">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="Label Key">
          <el-input
            v-model="formInline.labels_name"
            placeholder="App标签"
          ></el-input>
        </el-form-item>

        <el-form-item label="Label Value">
          <el-input
            v-model="formInline.labels_value"
            placeholder="标签的值默认服务名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <hr />
    </div>

    <div style="display: flex;margin-left: 200px" >
      <div>
        <el-radio-group v-model="tabPosition" style="margin-bottom: 60px">
        </el-radio-group>
        <el-tabs :tab-position="tabPosition" style="height: 600px">
          <el-tab-pane label="Init 容器">
           </el-tab-pane>
          <el-tab-pane label="应用容器"></el-tab-pane>
          <el-tab-pane label="日志收集"></el-tab-pane>
          <el-tab-pane label="其他容器"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="tab-pane-with-margin" style="margin-bottom: 30px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="测试环境" name="first"> 
               <Dev />
          </el-tab-pane>

          <el-tab-pane label="灰度环境" name="second"> 
              <Pre /> 
          </el-tab-pane>
  
          <el-tab-pane label="生产环境" name="third"> 
           <Prod />

          </el-tab-pane>
        </el-tabs>

      </div>
    </div>
  </div>
</template>

<script>
import Prod from "./components/prod/index.vue";
import Pre from "./components/pre/index.vue";
import Dev from "./components/dev/index.vue";
export default {
  components: {
    Prod,
    Pre,
    Dev,
  },
  data() {
    return {
      activeName: "first",
      formInline: {
        labels_name: "app",
        labels_value: "",
      },
      tabPosition: "left",
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>
