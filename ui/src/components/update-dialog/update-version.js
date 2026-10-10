// 更新检查的默认版本比较；应用可通过 compareVersions 注入自己的版本规则。
function parseVersion(version) {
  const text = String(version || '').trim();
  const match = /^v?(\d+(?:\.\d+)*)(?:-([\da-z-]+(?:\.[\da-z-]+)*))?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?$/i.exec(text);
  if (!match) throw new TypeError(`无法比较版本号：${text || '空版本号'}`);
  return { core: match[1].split('.').map(BigInt), prerelease: match[2]?.split('.') || [] };
}

function compareIdentifier(left, right) {
  if (left === right) return 0;
  if (left === undefined) return -1;
  if (right === undefined) return 1;
  const leftNumeric = /^\d+$/.test(left);
  const rightNumeric = /^\d+$/.test(right);
  if (leftNumeric && rightNumeric) {
    const leftNumber = BigInt(left);
    const rightNumber = BigInt(right);
    return leftNumber === rightNumber ? 0 : leftNumber > rightNumber ? 1 : -1;
  }
  if (leftNumeric !== rightNumeric) return leftNumeric ? -1 : 1;
  return left > right ? 1 : -1;
}

export function compareUpdateVersions(leftVersion, rightVersion) {
  const left = parseVersion(leftVersion);
  const right = parseVersion(rightVersion);
  for (let index = 0; index < Math.max(left.core.length, right.core.length); index += 1) {
    const leftNumber = left.core[index] || 0n;
    const rightNumber = right.core[index] || 0n;
    if (leftNumber !== rightNumber) return leftNumber > rightNumber ? 1 : -1;
  }
  if (!left.prerelease.length && !right.prerelease.length) return 0;
  if (!left.prerelease.length) return 1;
  if (!right.prerelease.length) return -1;
  for (let index = 0; index < Math.max(left.prerelease.length, right.prerelease.length); index += 1) {
    const result = compareIdentifier(left.prerelease[index], right.prerelease[index]);
    if (result) return result;
  }
  return 0;
}
