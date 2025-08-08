import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../modules/auth/guard/jwt-auth.guard';

/**
 * Auth decorator, provides accessToken validation
 */

export const WithAuth = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiResponse({
      status: 401,
      description: 'Access token has expired, need to refresh or not exists',
    }),
    UseGuards(JwtAuthGuard),
  );
};
