<template>
  <div>
    <mavon-editor
        :boxShadow="false"
        :defaultOpen="'preview'"
        :editable="false"
        :previewBackground="background"
        :subfield="false"
        :toolbarsFlag="false"
        :value="mkValue"
        style="font-size: 20px"
    ></mavon-editor>
  </div>
</template>

<script>
export default {
  name: "MavonEditor",
  props: ["mkValue", "background"],
};
</script>

<style scoped></style>