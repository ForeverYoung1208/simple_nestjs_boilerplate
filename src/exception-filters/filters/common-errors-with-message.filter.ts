import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotAcceptableException,
  UnprocessableEntityException,
  Logger,
  Inject,
} from '@nestjs/common';
import { IExceptionFiltersConfig, TErrorResponseBody } from '../types';
import { ErrorCodes } from '../../constants/system';
import { NotFoundException } from '@nestjs/common';
import { ICustomException } from '../../exceptions/types';
import { AccessCommonException } from '../../exceptions/access-exceptions';
import { EXCEPTION_FILTER_CONFIG_TOKEN } from '../constants';

@Catch(
  // built-in http exceptions
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  NotAcceptableException,
  UnprocessableEntityException,

  // custom exceptions
  AccessCommonException,
)
@Injectable()
export class CommonErrorsWithMessageFilter implements ExceptionFilter {
  constructor(
    @Inject(EXCEPTION_FILTER_CONFIG_TOKEN)
    private readonly exceptionFiltersConfig: IExceptionFiltersConfig,
  ) {}
  private readonly logger = new Logger(this.constructor.name);

  catch(error: ICustomException | HttpException, host: ArgumentsHost): void {
    let errorCode: ErrorCodes = ErrorCodes.COMMON_ERROR_WITH_MESSAGE;
    if ('errorCode' in error && error.errorCode) {
      errorCode = error.errorCode;
    }

    const errorResponseBody: TErrorResponseBody = {
      errorCode,
      message: error.message || 'Common error with message',
    };

    if (this.exceptionFiltersConfig.doLogCommonErrors) {
      this.logger.log({
        errorClass: error.constructor.name,
        method: host.switchToHttp().getRequest().method,
        path: host.switchToHttp().getRequest().url,
        errorResponseBody,
        stack: error.stack,
      });
    }

    const contextType = host.getType();

    if (contextType !== 'http') {
      throw new Error(JSON.stringify(errorResponseBody));
    }

    host
      .switchToHttp()
      .getResponse()
      .status(error.getStatus() || HttpStatus.BAD_REQUEST)
      .json(errorResponseBody);
  }
}
