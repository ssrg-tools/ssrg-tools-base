export function boxSplit(input: string | string[], split = ' ') {
  if (typeof input === 'string') {
    return input.split(split);
  }
  return input;
}
