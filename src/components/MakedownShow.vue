<template>
  <div>
    <mavon-editor
      :boxShadow="false"
      :defaultOpen="'preview'"
      :editable="false"
      :subfield="false"
      :toolbarsFlag="false"
      :value="mkValue"
      style="font-size: 20px"
    ></mavon-editor>
  </div>
</template>

<script>
export default {
  name: 'MakedownShow',
  props: ['mkValue']
};
</script>

<style scoped></style>
