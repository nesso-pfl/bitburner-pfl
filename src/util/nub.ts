/**
 * 引数の配列内の重複した要素を削除
 */
export const nub = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};
