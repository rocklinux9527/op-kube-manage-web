<template>
  <div width="600px">
    <el-form
      :label-position="labelPosition"
      label-width="150px"
      :model="formLabelAlign"
    >
      <el-form-item label="副本数:">
        <el-input-number v-model="num" @change="handleChange" :min="2" :max="10" label="描述文字"></el-input-number>
      </el-form-item>
      <el-form-item label="RequestsCpu(m):">
        <el-input v-model="formLabelAlign.region"></el-input>
      </el-form-item>
      <el-form-item label="RequestsMem(Mi):">
        <el-input v-model="formLabelAlign.type"></el-input>
      </el-form-item>

      <el-form-item label="LimitsCpu(m):">
        <el-input v-model="formLabelAlign.region"></el-input>
      </el-form-item>
      <el-form-item label="LimitsMem(Mi):">
        <el-input v-model="formLabelAlign.type"></el-input>
      </el-form-item>

      <el-form-item label="PostStart:">
        <el-input v-model="formLabelAlign.type"></el-input>
      </el-form-item>

      <el-form-item label="PreStop(Mi):">
        <el-input v-model="formLabelAlign.type"></el-input>
      </el-form-item>

      <el-form-item label="Command:">
        <el-input v-model="formLabelAlign.type"></el-input>
      </el-form-item>

      <el-form-item label="环境变量:">
        <el-input v-model="formLabelAlign.type"></el-input>
      </el-form-item>
             <el-button type="primary"> 保存</el-button>  
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      num: 1,  
      labelPosition: "right",
      formLabelAlign: {
        name: "",
        region: "",
        type: "",
      },
    };
  },
};
</script>