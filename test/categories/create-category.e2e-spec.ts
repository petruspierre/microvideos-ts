import request from 'supertest';
import { CreateCategoryFixture } from 'src/nest-modules/categories-module/testing/category-fixture';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories-module/categories.providers';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { CategoriesController } from 'src/nest-modules/categories-module/categories.controller';
import { CategoryOutputMapper } from '@core/category/application/use-cases/common/category-output-mapper';
import { instanceToPlain } from 'class-transformer';

describe('CategoriesControlelr (e2e)', () => {
  const appHelper = startApp();
  let categoryRepository: ICategoryRepository;

  beforeEach(async () => {
    categoryRepository = appHelper.app.get<ICategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
  });

  describe('/categories (POST)', () => {
    describe('should return a response error when request body is invalid', () => {
      const invalidRequest = CreateCategoryFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post('/categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should return a response error when invalid domain entity is provided', () => {
      const invalidRequest =
        CreateCategoryFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post('/categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('create category', () => {
      const arrange = CreateCategoryFixture.arrangeForCreate();

      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const res = await request(appHelper.app.getHttpServer())
            .post('/categories')
            .send(send_data)
            .expect(201);

          const keysInResponse = CreateCategoryFixture.keysInResponse;
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);

          const id = res.body.data.id;
          const category = await categoryRepository.findById(new Uuid(id));

          const presenter = CategoriesController.serialize(
            CategoryOutputMapper.toOutput(category!),
          );
          const serialized = instanceToPlain(presenter);

          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            ...expected,
          });
        },
      );
    });
  });
});
