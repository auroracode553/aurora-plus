<script setup>
import { AuAvatar } from 'aurora-plus';

const image = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#e8eef8"/><circle cx="32" cy="24" r="12" fill="#3478f6"/><path d="M10 64v-8a22 22 0 0 1 44 0v8" fill="#3478f6"/></svg>');
</script>

<template>
  <div class="avatar-example">
    <AuAvatar name="陈晓" size="small" />
    <AuAvatar name="Lin Chen" />
    <AuAvatar name="Aurora" shape="square" size="large" />
    <AuAvatar :src="image" name="图像头像" />
    <AuAvatar src="data:image/png;base64,AA==" name="林楠" />
    <AuAvatar :size="48">A</AuAvatar>
    <AuAvatar />
  </div>
</template>

<style scoped>
.avatar-example { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
</style>
