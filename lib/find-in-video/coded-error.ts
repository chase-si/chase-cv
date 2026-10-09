export type NoticeValues = Record<string, string | number>;

export class CodedError extends Error {
  readonly values?: NoticeValues;

  constructor(code: string, values?: NoticeValues) {
    super(code);
    this.name = "CodedError";
    this.values = values;
  }
}

export type StatusNotice = {
  code: string;
  values?: NoticeValues;
};
