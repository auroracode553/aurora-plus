export function normalizePath(path) {
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

export function getRulesByPath(rules, path) {
  if (!rules || path == null || path === '') return [];
  const directKey = Array.isArray(path) ? path.join('.') : String(path);
  if (Object.prototype.hasOwnProperty.call(rules, directKey)) return normalizeRules(rules[directKey]);
  return normalizeRules(getFieldValue(rules, path));
}

export async function validateRules(value, rules, model, trigger = '', options = {}) {
  const activeRules = normalizeRules(rules).filter((rule) => matchesTrigger(rule, trigger));
  for (const rule of activeRules) {
    const error = await validateRule(value, rule, model, options);
    if (error) return error;
  }
  return '';
}

async function validateRule(rawValue, rule, model, options) {
  let value = rawValue;
  if (typeof rule.transform === 'function') {
    try {
      value = rule.transform(rawValue);
    } catch (error) {
      return normalizeValidationError(error, rule.message || '字段转换失败');
    }
  }

  const empty = isEmptyValue(value);
  const whitespaceOnly = rule.whitespace && typeof value === 'string' && value.trim() === '';
  if (rule.required && (empty || whitespaceOnly)) return rule.message || '该字段为必填项';
  if (empty) return '';

  if (rule.type && !matchesType(value, rule.type)) {
    return rule.message || `字段类型应为 ${rule.type}`;
  }
  if (rule.enum && !rule.enum.some((item) => Object.is(item, value))) {
    return rule.message || '字段值不在允许范围内';
  }
  if (rule.pattern) {
    try {
      const pattern = toRegExp(rule.pattern);
      pattern.lastIndex = 0;
      if (!pattern.test(String(value))) return rule.message || '字段格式不正确';
    } catch {
      return rule.message || '字段校验规则无效';
    }
  }

  const size = getValueSize(value);
  if (rule.len != null && size !== Number(rule.len)) return rule.message || `长度应为 ${rule.len}`;
  if (rule.min != null && size < Number(rule.min)) return rule.message || `不能小于 ${rule.min}`;
  if (rule.max != null && size > Number(rule.max)) return rule.message || `不能大于 ${rule.max}`;

  const nestedError = await validateNestedFields(value, rule, model, options);
  if (nestedError) return nestedError;

  const validator = rule.asyncValidator || rule.validator;
  if (typeof validator === 'function') {
    return runCustomValidator(rule, validator, value, model, options);
  }
  return '';
}

async function validateNestedFields(value, rule, model, options) {
  if (rule.defaultField && (Array.isArray(value) || isPlainObject(value))) {
    for (const item of Object.values(value)) {
      const error = await validateRules(item, rule.defaultField, model, '', options);
      if (error) return rule.message || error;
    }
  }
  if (rule.fields && (Array.isArray(value) || isPlainObject(value))) {
    for (const [field, fieldRules] of Object.entries(rule.fields)) {
      const error = await validateRules(value[field], fieldRules, model, '', options);
      if (error) return rule.message || error;
    }
  }
  return '';
}

function runCustomValidator(rule, validator, value, model, options) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (error = '') => {
      if (settled) return;
      settled = true;
      resolve(normalizeValidationError(error, rule.message || '校验失败'));
    };

    try {
      const result = validator(rule, value, finish, model, options);
      if (result && typeof result.then === 'function') {
        result.then(finish).catch(finish);
      } else if (result === false || result instanceof Error || typeof result === 'string') {
        finish(result);
      } else if (Array.isArray(result)) {
        finish(result);
      } else if (validator.length < 3) {
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
  if (isPlainObject(value)) return Object.keys(value).length;
  return 0;
}

function matchesType(value, type) {
  if (type === 'array') return Array.isArray(value);
  if (type === 'date') return value instanceof Date && Number.isFinite(value.getTime());
  if (type === 'integer') return Number.isInteger(value);
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  if (type === 'object') return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  if (type === 'regexp') return value instanceof RegExp;
  if (type === 'method') return typeof value === 'function';
  if (type === 'hex') return /^#?(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(String(value));
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

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);
}

function normalizeValidationError(error, fallback) {
  if (Array.isArray(error)) return normalizeValidationError(error[0], fallback);
  if (error instanceof Error) return error.message || fallback;
  if (error && typeof error === 'object' && error.message) return String(error.message);
  if (error === false) return fallback;
  return error ? String(error) : '';
}
