export const ENV_LOCAL = 'local';
export const ENV_DEV = 'development';
export const ENV_STAGE = 'staging';
export const ENV_PROD = 'production';
export const ENV_TEST = 'test';

export const REGEX_DATE_CHECK = new RegExp(/\\d{4}-\\d{2}-\\d{2}/);
export const REGEX_PASSWORD_CHECK = new RegExp(
  /^(?=.*\d)(?=.*[a-zA-Z\u0400-\u04FF])(?=.*\W).+$/,
);

export const DATE_FORMAT = 'YYYY-MM-DD';

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum ThrottlerRule {
  DEFAULT = 'default',
}

export enum AUTH_TYPES {
  JWT = 'JWT',
}

export enum ErrorCodes {
  UNKNOWN_ERROR = 'unknown-error',
  VALIDATION_FAILED = 'validation-failed',
  COMMON_ERROR_WITH_MESSAGE = 'common-error-with-message',
  DATA_PROCESSING_ERROR = 'data-processing-error',
  DATABASE_SERVER_ERROR = 'database-server-error',
  ACCESS_ERROR = 'access-error',
}
