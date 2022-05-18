export enum StatusCode {
  Success = 0, // 'S',
  Error = 1, // 'E',
  DataVersionError = 2, // 'I',
  DataCorruptError = 4, // 'C',
  DuplicatedIdError = 8, // 'P',
  RequiredIdError = 16, // 'Q',
}
