import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { WrapperDataInterceptor } from './nest-modules/shared-module/interceptors/wrapper-data/wrapper-data.interceptor';
import { Reflector } from '@nestjs/core';
import { NotFoundFilter } from './nest-modules/shared-module/filters/not-found/not-found.filter';
import { EntityValidationErrorFilter } from './nest-modules/shared-module/filters/entity-validation/entity-validation.filter';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new WrapperDataInterceptor(),
  );
  app.useGlobalFilters(new NotFoundFilter(), new EntityValidationErrorFilter());
}
