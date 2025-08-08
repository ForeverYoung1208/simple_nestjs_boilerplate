import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { ThrottlerRule } from '../constants/system';

export const throttlerConfig = (): ThrottlerModuleOptions => ({
  throttlers: [
    {
      name: ThrottlerRule.DEFAULT,
      ttl: 60_000,
      limit: 1000,
    },
  ],
});
