import { ErrorCodes } from '../constants/system';
import { ValidationExceptionPayload } from '../helpers/validation';

export type TValidationErrorBody = {
  errorCode: ErrorCodes.VALIDATION_FAILED;
  message: string;
  payload: ValidationExceptionPayload;
};

export type TCommonErrorBody = {
  errorCode: ErrorCodes;
  message: string;
  payload?: string;
};

export type TErrorResponseBody = TCommonErrorBody | TValidationErrorBody;

export interface IExceptionFiltersConfig {
  doAttachStack: boolean;
  doLogCommonErrors: boolean;
}
