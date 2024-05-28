import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function CustomAuthDecorator(
  defaultStatus: number,
  description: string,
  summary: string,
) {
  return applyDecorators(
    UseGuards(AuthGuard('access')),
    ApiBearerAuth('Access Token'),
    ApiResponse({ status: defaultStatus, description: description }),
    ApiOperation({ summary: summary }),
  );
}
