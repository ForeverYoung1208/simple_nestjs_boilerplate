import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ErrorCodes } from '../../constants/system';
import { EXCEPTION_FILTER_CONFIG_TOKEN } from '../constants';
import { IExceptionFiltersConfig, TErrorResponseBody } from '../types';

@Catch()
@Injectable()
export class UnhandledExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(EXCEPTION_FILTER_CONFIG_TOKEN)
    private readonly exceptionFiltersConfig: IExceptionFiltersConfig,
  ) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const payload = this.exceptionFiltersConfig.doAttachStack
      ? exception.stack
      : undefined;

    const errorResponseBody: TErrorResponseBody = {
      errorCode: ErrorCodes.UNKNOWN_ERROR,
      message: 'Unhandled error',
      payload,
    };

    this.logger.error({
      method: host.switchToHttp().getRequest().method,
      path: host.switchToHttp().getRequest().url,
      errorResponseBody,
      stack: exception.stack,
    });

    const contextType = host.getType();

    if (contextType !== 'http') {
      throw new Error(JSON.stringify(errorResponseBody));
    }

    host
      .switchToHttp()
      .getResponse()
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponseBody);
  }
}
