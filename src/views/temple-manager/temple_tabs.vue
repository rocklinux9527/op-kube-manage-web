<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="应用模版" name="first">
      <App />
    </el-tab-pane>

    <el-tab-pane label="Deployment模版" name="second">
      <Deployment />

    </el-tab-pane>

    <el-tab-pane label="Service模版" name="third">
     
     <Service />

    </el-tab-pane>

    <el-tab-pane label="Ingress模版" name="fourth">

      <Ingress />

    </el-tab-pane>

     <el-tab-pane label="Dockefile模版" name="five">

      <Dockerfile />
    </el-tab-pane>

  </el-tabs>
</template>
<script>
import App from "./components/application/index.vue";
import Deployment from "./components/deployment/index.vue";
import Service from "./components/service/index.vue";
import Dockerfile from "./components/dockerfile/index.vue";
import Ingress from "./components/ingress/index.vue";

export default {
  components: {
    App,
    Deployment,
    Service,
    Ingress,
    Dockerfile,
  },
  data() {
    return {
      activeName: "first",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>
