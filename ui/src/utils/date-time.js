const FORMAT_TOKEN_PATTERN = /(YYYY|MM|DD|HH|mm|ss)/g;

function pad(value, length = 2) {
  return String(value).padStart(length, '0');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function isValidDate(value) {
  return value instanceof Date && Number.isFinite(value.getTime());
}

export function cloneDate(value) {
  return isValidDate(value) ? new Date(value.getTime()) : null;
}

export function createLocalDate({
  year,
  month = 1,
  day = 1,
  hour = 0,
  minute = 0,
  second = 0,
}) {
  const date = new Date(year, month - 1, day, hour, minute, second, 0);
  // JavaScript 会把 0–99 年映射到 1900–1999，需要显式恢复原年份。
  date.setFullYear(year);
  if (
    date.getFullYear() !== year
    || date.getMonth() !== month - 1
    || date.getDate() !== day
    || date.getHours() !== hour
    || date.getMinutes() !== minute
    || date.getSeconds() !== second
  ) return null;
  return date;
}

export function parseDateByFormat(value, format, baseDate = new Date()) {
  if (typeof value !== 'string' || !format) return null;
  const tokenNames = [];
  let expression = '^';
  let lastIndex = 0;

  for (const match of format.matchAll(FORMAT_TOKEN_PATTERN)) {
    expression += escapeRegExp(format.slice(lastIndex, match.index));
    expression += match[0] === 'YYYY' ? '(\\d{4})' : '(\\d{1,2})';
    tokenNames.push(match[0]);
    lastIndex = match.index + match[0].length;
  }
  expression += `${escapeRegExp(format.slice(lastIndex))}$`;

  const result = value.trim().match(new RegExp(expression));
  if (!result) return null;

  const parts = {
    year: baseDate.getFullYear(),
    month: baseDate.getMonth() + 1,
    day: baseDate.getDate(),
    hour: 0,
    minute: 0,
    second: 0,
  };
  const partNames = {
    YYYY: 'year',
    MM: 'month',
    DD: 'day',
    HH: 'hour',
    mm: 'minute',
    ss: 'second',
  };
  tokenNames.forEach((token, index) => {
    parts[partNames[token]] = Number(result[index + 1]);
  });
  return createLocalDate(parts);
}

export function parseDateValue(value, format = 'YYYY-MM-DD', baseDate = new Date()) {
  if (value == null || value === '') return null;
  if (isValidDate(value)) return cloneDate(value);
  if (typeof value === 'number') {
    const date = new Date(value);
    return isValidDate(date) ? date : null;
  }
  if (typeof value !== 'string') return null;

  const formattedDate = parseDateByFormat(value, format, baseDate);
  if (formattedDate) return formattedDate;

  // 接受常见本地 ISO 写法，但不把纯日期交给 UTC 解析，避免跨时区偏移。
  const isoMatch = value.trim().match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/,
  );
  if (!isoMatch) return null;
  return createLocalDate({
    year: Number(isoMatch[1]),
    month: Number(isoMatch[2]),
    day: Number(isoMatch[3]),
    hour: Number(isoMatch[4] || 0),
    minute: Number(isoMatch[5] || 0),
    second: Number(isoMatch[6] || 0),
  });
}

export function formatDate(value, format = 'YYYY-MM-DD') {
  if (!isValidDate(value)) return '';
  const replacements = {
    YYYY: pad(value.getFullYear(), 4),
    MM: pad(value.getMonth() + 1),
    DD: pad(value.getDate()),
    HH: pad(value.getHours()),
    mm: pad(value.getMinutes()),
    ss: pad(value.getSeconds()),
  };
  return format.replace(FORMAT_TOKEN_PATTERN, (token) => replacements[token]);
}

export function resolveValueType(currentValue, requestedType = 'auto') {
  if (requestedType !== 'auto') return requestedType;
  if (currentValue instanceof Date) return 'date';
  if (typeof currentValue === 'number') return 'timestamp';
  return 'string';
}

export function toPickerValue(date, valueType, format, currentValue) {
  if (!isValidDate(date)) return emptyPickerValue(valueType, currentValue);
  const resolvedType = resolveValueType(currentValue, valueType);
  if (resolvedType === 'date') return cloneDate(date);
  if (resolvedType === 'timestamp') return date.getTime();
  return formatDate(date, format);
}

export function emptyPickerValue(valueType, currentValue) {
  return resolveValueType(currentValue, valueType) === 'string' ? '' : null;
}

export function serializePickerValue(value, format) {
  const date = parseDateValue(value, format);
  return date ? formatDate(date, format) : '';
}

export function startOfDay(value) {
  if (!isValidDate(value)) return null;
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

export function isSameDay(left, right) {
  return Boolean(
    isValidDate(left)
    && isValidDate(right)
    && left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate(),
  );
}

export function dateKey(value) {
  return formatDate(value, 'YYYY-MM-DD');
}

export function addDays(value, amount) {
  const date = cloneDate(value);
  if (!date) return null;
  date.setDate(date.getDate() + amount);
  return date;
}

export function addMonths(value, amount) {
  const date = cloneDate(value);
  if (!date) return null;
  const originalDay = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + amount);
  date.setDate(Math.min(originalDay, daysInMonth(date.getFullYear(), date.getMonth())));
  return date;
}

export function addYears(value, amount) {
  const date = cloneDate(value);
  if (!date) return null;
  const originalMonth = date.getMonth();
  date.setDate(1);
  date.setFullYear(date.getFullYear() + amount);
  date.setMonth(originalMonth);
  date.setDate(Math.min(value.getDate(), daysInMonth(date.getFullYear(), originalMonth)));
  return date;
}

export function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function mergeDateAndTime(dateValue, timeValue) {
  if (!isValidDate(dateValue) || !isValidDate(timeValue)) return null;
  const result = cloneDate(dateValue);
  result.setHours(timeValue.getHours(), timeValue.getMinutes(), timeValue.getSeconds(), 0);
  return result;
}

export function isDayDisabled(value, { minDate, maxDate, disabledDate } = {}) {
  const day = startOfDay(value);
  const minDay = startOfDay(minDate);
  const maxDay = startOfDay(maxDate);
  if (!day) return true;
  if (minDay && day < minDay) return true;
  if (maxDay && day > maxDay) return true;
  return typeof disabledDate === 'function' && Boolean(disabledDate(cloneDate(value)));
}

export function clampDateTime(value, minDate, maxDate) {
  if (!isValidDate(value)) return null;
  if (isValidDate(minDate) && value < minDate) return cloneDate(minDate);
  if (isValidDate(maxDate) && value > maxDate) return cloneDate(maxDate);
  return cloneDate(value);
}

export function timeToSeconds(value) {
  if (!isValidDate(value)) return null;
  return value.getHours() * 3600 + value.getMinutes() * 60 + value.getSeconds();
}

export function isTimeDisabled(value, { minTime, maxTime, disabledTime } = {}) {
  if (!isValidDate(value)) return true;
  const seconds = timeToSeconds(value);
  const minSeconds = timeToSeconds(minTime);
  const maxSeconds = timeToSeconds(maxTime);
  if (minSeconds != null && seconds < minSeconds) return true;
  if (maxSeconds != null && seconds > maxSeconds) return true;
  return typeof disabledTime === 'function' && Boolean(disabledTime(cloneDate(value)));
}

export function clampTime(value, minTime, maxTime) {
  if (!isValidDate(value)) return null;
  const result = cloneDate(value);
  const seconds = timeToSeconds(result);
  const minSeconds = timeToSeconds(minTime);
  const maxSeconds = timeToSeconds(maxTime);
  const boundary = minSeconds != null && seconds < minSeconds
    ? minTime
    : (maxSeconds != null && seconds > maxSeconds ? maxTime : null);
  if (boundary) {
    result.setHours(boundary.getHours(), boundary.getMinutes(), boundary.getSeconds(), 0);
  }
  return result;
}

export function getWeekdayLabels(locale = 'zh-CN', firstDayOfWeek = 1) {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const sunday = new Date(2021, 7, 1);
  const firstDay = normalizeFirstDayOfWeek(firstDayOfWeek);
  return Array.from({ length: 7 }, (_, index) => (
    formatter.format(addDays(sunday, (firstDay + index) % 7))
  ));
}

export function getMonthLabel(value, locale = 'zh-CN') {
  if (!isValidDate(value)) return '';
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(value);
}

export function buildCalendarDays(viewDate, selectedDate, firstDayOfWeek = 1) {
  const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const firstDay = normalizeFirstDayOfWeek(firstDayOfWeek);
  const leadingDays = (firstOfMonth.getDay() - firstDay + 7) % 7;
  const gridStart = addDays(firstOfMonth, -leadingDays);
  const today = new Date();

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    return {
      date,
      key: dateKey(date),
      label: date.getDate(),
      isCurrentMonth: date.getMonth() === viewDate.getMonth(),
      isSelected: isSameDay(date, selectedDate),
      isToday: isSameDay(date, today),
    };
  });
}

export function normalizeStep(value, fallback = 1) {
  const number = Number.parseInt(value, 10);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

export function buildSteppedValues(max, step, currentValue) {
  const normalizedStep = normalizeStep(step);
  const values = [];
  for (let value = 0; value <= max; value += normalizedStep) values.push(value);
  if (Number.isInteger(currentValue) && currentValue >= 0 && currentValue <= max) {
    values.push(currentValue);
  }
  return [...new Set(values)].sort((left, right) => left - right);
}

function normalizeFirstDayOfWeek(value) {
  const day = Number(value);
  return Number.isInteger(day) && day >= 0 && day <= 6 ? day : 1;
}
