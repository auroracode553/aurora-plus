import { readonly, ref } from 'vue';
import {
  DEFAULT_AURORA_MATERIAL,
  getAuroraMaterial,
  isAuroraMaterial,
  setAuroraMaterial,
} from 'aurora-ui';

const MATERIAL_STORAGE_KEY = 'aurora-ui-docs-material';
const material = ref(DEFAULT_AURORA_MATERIAL);

export function initializeDocsMaterial() {
  const savedMaterial = readSavedMaterial();
  const initialMaterial = savedMaterial || DEFAULT_AURORA_MATERIAL;

  setAuroraMaterial(initialMaterial);
  return initialMaterial;
}

export function syncDocsMaterial() {
  material.value = getAuroraMaterial();
  return material.value;
}

export function setDocsMaterial(value) {
  if (!setAuroraMaterial(value)) return false;

  material.value = value;
  saveMaterial(value);
  return true;
}

export function useDocsMaterial() {
  return readonly(material);
}

function readSavedMaterial() {
  if (typeof window === 'undefined') return null;

  try {
    const savedMaterial = window.localStorage.getItem(MATERIAL_STORAGE_KEY);
    return isAuroraMaterial(savedMaterial) ? savedMaterial : null;
  } catch {
    return null;
  }
}

function saveMaterial(value) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(MATERIAL_STORAGE_KEY, value);
  } catch {
    // 禁用存储时仍保留当前页面会话中的全局材质切换。
  }
}
