<script setup>
import { ref } from 'vue';
import { AuButton, AuCard, AuTransition, AuTransitionGroup } from 'aurora-plus';

const visible = ref(true);
const items = ref([{ id: 1, label: '第一项' }, { id: 2, label: '第二项' }]);
let nextId = 3;
function add() {
  if (items.value.length >= 6) return;
  const id = nextId++;
  items.value.push({ id, label: '条目 ' + id });
}
function remove(id) { items.value = items.value.filter(item => item.id !== id); }
</script>

<template>
  <div class="transition-example">
    <div class="transition-example__actions">
      <AuButton size="small" @click="visible = !visible">切换内容</AuButton>
      <AuButton size="small" :disabled="items.length >= 6" @click="add">添加条目</AuButton>
    </div>
    <div class="transition-example__single">
      <AuTransition preset="scale" appear>
        <AuCard v-if="visible" padding="compact" hoverable>悬停轻微抬起，点击上方按钮切换显隐。</AuCard>
      </AuTransition>
    </div>
    <AuTransitionGroup class="transition-example__list" :stagger="40" appear>
      <AuCard v-for="item in items" :key="item.id" padding="compact">
        <div class="transition-example__row">
          <span>{{ item.label }}</span>
          <AuButton type="menu" size="small" @click="remove(item.id)">移除</AuButton>
        </div>
      </AuCard>
    </AuTransitionGroup>
  </div>
</template>

<style scoped>
.transition-example { display: grid; width: min(480px, 100%); gap: 12px; }
.transition-example__actions, .transition-example__row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.transition-example__row { justify-content: space-between; }
.transition-example__single { min-height: 50px; }
.transition-example__list { display: grid; gap: 6px; }
</style>
