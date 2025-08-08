import { databaseConfig } from './db/database.config';

import { envValidationConfig } from './env-validation.config';
import { ENV_TEST } from '../constants/system';
import { throttlerConfig } from './throttler.config';

export const envFilePath = (): string =>
  process.env.NODE_ENV === ENV_TEST ? '.env.test' : '.env';

export default () => ({
  databaseConfig,
  envValidationConfig,
  throttlerConfig,
});
