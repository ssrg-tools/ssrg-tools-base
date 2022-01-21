/** a.json */
export interface InfoAggregate {
  version: number;
  context: {
    [infoName: string]: InfoFileEntry;
  };
}

export interface InfoFileEntry {
  file: string;
  version: number;
}
