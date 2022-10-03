export const arrToString = (arr: any[]): string => {
  return arr.reduce((prev: string, curr: string, idx: number) => {
    return idx == 0 ? curr : prev + ", " + curr;
  });
};
