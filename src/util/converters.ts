export const arrToString = (arr: any[]): string => {
  return arr.reduce((prev: string, curr: string, idx: number) => {
    return idx == 0 ? curr : prev + ", " + curr;
  });
};

export const arrToChainOfSQLOR = (arr: any[]): string => {
  return arr.reduce((prev: string, curr: string, idx: number) => {
    return idx == 0 ? `NAME = "${curr}"` : `${prev} OR NAME = "${curr}"`;
  }, "");
};
