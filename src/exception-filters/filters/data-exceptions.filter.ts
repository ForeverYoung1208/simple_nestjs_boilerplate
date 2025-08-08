import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
  Logger,
} from '@nestjs/common';
import { TErrorResponseBody } from '../types';
import { ErrorCodes } from '../../constants/system';
import { DataException } from '../../exceptions/data-exceptions';

@Catch(DataException)
@Injectable()
export class DataExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(DataExceptionsFilter.name);

  catch(exception: DataException, host: ArgumentsHost): void {
    const errorResponseBody: TErrorResponseBody = {
      errorCode: exception.errorCode || ErrorCodes.DATA_PROCESSING_ERROR,
      message: exception.message || 'Data processing error',
    };

    const contextType = host.getType();

    this.logger.error({
      method: host.switchToHttp()?.getRequest()?.method,
      path: host.switchToHttp()?.getRequest()?.url,
      errorResponseBody,
      stack: exception.stack,
    });

    if (contextType !== 'http') {
      throw new Error(JSON.stringify(errorResponseBody));
    }

    host
      .switchToHttp()
      .getResponse()
      .status(exception.getStatus())
      .json(errorResponseBody);
  }
}
