<template>
  <div class="au-release-notes">
    <div v-for="(group, index) in groups" :key="index" class="au-release-notes__group">
      <h5 v-if="group.title">{{ group.title }}</h5>
      <div v-if="group.html" class="au-release-notes__markdown" v-html="group.html"></div>
      <ul v-else>
        <li v-for="(item, itemIndex) in group.items" :key="itemIndex">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// 内部展示组件：调用方负责归一化日志及控制滚动区域。
defineProps({ groups: { type: Array, default: () => [] } });
</script>

<style scoped lang="scss" src="./AuReleaseNotes.scss"></style>
