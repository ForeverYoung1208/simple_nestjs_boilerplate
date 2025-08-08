import * as Joi from 'joi';
import {
  ENV_DEV,
  ENV_LOCAL,
  ENV_PROD,
  ENV_STAGE,
  ENV_TEST,
} from '../constants/system';

export const envValidationConfig = Joi.object({
  PORT: Joi.number().required(),
  NODE_ENV: Joi.string()
    .valid(ENV_LOCAL, ENV_DEV, ENV_STAGE, ENV_PROD, ENV_TEST)
    .required(),

  SITE_ORIGIN: Joi.string().required(),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),

  TYPEORM_LOGGING: Joi.string().valid('true', 'false').default('false'),

  ACCESS_TOKEN_TTL: Joi.number().default(3600),
  REFRESH_TOKEN_TTL: Joi.number().default(3600 * 8),

  JWT_SECRET_KEY: Joi.string().min(5).max(100).required(),
  BCRYPT_SALT_ROUNDS: Joi.number().required(),
});
