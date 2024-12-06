type DataKey = string;
type DataValue = string | number | boolean;
type Data = Record<DataKey, DataValue>;

export const tprintTable = <T extends Data, S extends keyof T & string>(ns: NS, data: T[], orders: S[]) => {
  const maxLengthes = orders.map((key) => {
    return [key.length, ...data.map((item) => showData(item[key]).length)].reduce(
      (acc, cur) => (acc > cur ? acc : cur),
      0,
    );
  });

  const head = orders.map((key, index) => key.padEnd(maxLengthes[index])).join(' | ');
  const divider = '-'.repeat(head.length);
  const body = data
    .map((item) => orders.map((key, index) => showData(item[key]).padEnd(maxLengthes[index])).join(' | '))
    .join('\n');

  ns.tprint(`\n${head}\n${divider}\n${body}`);
};

const showData = (dataValue: DataValue) => {
  if (typeof dataValue === 'boolean') {
    return dataValue ? '○' : '×';
  } else {
    return String(dataValue);
  }
};
