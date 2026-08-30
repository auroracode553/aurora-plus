function normalizePath(path) {
  if (Array.isArray(path)) return path;
  return String(path || '')
    .replace(/\[([^\]]+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);
}

export function getFieldValue(model, path) {
  return normalizePath(path).reduce((value, segment) => value?.[segment], model);
}

export function setFieldValue(model, path, value) {
  const segments = normalizePath(path);
  if (!model || segments.length === 0) return;
  let target = model;
  segments.slice(0, -1).forEach((segment, index) => {
    if (target[segment] == null || typeof target[segment] !== 'object') {
      target[segment] = /^\d+$/.test(segments[index + 1]) ? [] : {};
    }
    target = target[segment];
  });
  target[segments[segments.length - 1]] = cloneFieldValue(value);
}

export function cloneFieldValue(value) {
  if (value instanceof Date) return new Date(value.getTime());
  if (Array.isArray(value)) return value.map(cloneFieldValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneFieldValue(item)]));
  }
  return value;
}

export function normalizeRules(rules) {
  if (!rules) return [];
  return Array.isArray(rules) ? rules.filter(Boolean) : [rules];
}

export async function validateRules(value, rules, model, trigger = '') {
  const activeRules = normalizeRules(rules).filter((rule) => matchesTrigger(rule, trigger));
  for (const rule of activeRules) {
    const error = await validateRule(value, rule, model);
    if (error) return error;
  }
  return '';
}

async function validateRule(value, rule, model) {
  const empty = isEmptyValue(value);
  if (rule.required && empty) return rule.message || '该字段为必填项';
  if (empty) return '';

  if (rule.type && !matchesType(value, rule.type)) {
    return rule.message || `字段类型应为 ${rule.type}`;
  }
  if (rule.enum && !rule.enum.some((item) => Object.is(item, value))) {
    return rule.message || '字段值不在允许范围内';
  }
  if (rule.pattern) {
    const pattern = toRegExp(rule.pattern);
    pattern.lastIndex = 0;
    if (!pattern.test(String(value))) return rule.message || '字段格式不正确';
  }

  const size = getValueSize(value);
  if (rule.len != null && size !== Number(rule.len)) return rule.message || `长度应为 ${rule.len}`;
  if (rule.min != null && size < Number(rule.min)) return rule.message || `不能小于 ${rule.min}`;
  if (rule.max != null && size > Number(rule.max)) return rule.message || `不能大于 ${rule.max}`;

  if (typeof rule.validator === 'function') {
    return runCustomValidator(rule, value, model);
  }
  return '';
}

function runCustomValidator(rule, value, model) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (error = '') => {
      if (settled) return;
      settled = true;
      if (error instanceof Error) resolve(error.message || rule.message || '校验失败');
      else if (error === false) resolve(rule.message || '校验失败');
      else resolve(error ? String(error) : '');
    };

    try {
      const result = rule.validator(rule, value, finish, model);
      if (result && typeof result.then === 'function') {
        result.then(finish).catch(finish);
      } else if (result === false || result instanceof Error || typeof result === 'string') {
        finish(result);
      } else if (rule.validator.length < 3) {
        finish();
      }
    } catch (error) {
      finish(error);
    }
  });
}

function matchesTrigger(rule, trigger) {
  if (!trigger || !rule.trigger) return true;
  const triggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger];
  return triggers.includes(trigger);
}

function isEmptyValue(value) {
  return value == null || value === '' || (Array.isArray(value) && value.length === 0);
}

function getValueSize(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' || Array.isArray(value)) return value.length;
  return 0;
}

function matchesType(value, type) {
  if (type === 'array') return Array.isArray(value);
  if (type === 'date') return value instanceof Date && Number.isFinite(value.getTime());
  if (type === 'integer') return Number.isInteger(value);
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  if (type === 'object') return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  if (type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
  if (type === 'url') {
    try {
      return Boolean(new URL(String(value)));
    } catch {
      return false;
    }
  }
  return typeof value === type;
}

function toRegExp(pattern) {
  return pattern instanceof RegExp ? pattern : new RegExp(pattern);
}
