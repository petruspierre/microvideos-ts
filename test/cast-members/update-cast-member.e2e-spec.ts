import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { CastMember } from '../../src/core/cast-member/domain/cast-member.aggregate';
import { ICastMemberRepository } from '../../src/core/cast-member/domain/cast-member.repository';
import { Uuid } from '../../src/core/shared/domain/value-objects/uuid.vo';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { UpdateCastMemberFixture } from '../../src/nest-modules/cast-members-module/testing/cast-member-fixtures';
import { CastMembersController } from '../../src/nest-modules/cast-members-module/cast-members.controller';
import { CAST_MEMBERS_PROVIDERS } from '../../src/nest-modules/cast-members-module/cast-members.providers';
import { CastMemberOutputMapper } from '@core/cast-member/application/use-cases/common/cast-member-output-mapper';

describe('CastMembersController (e2e)', () => {
  const uuid = '96bdc41a-a41e-4e0b-ad96-ad66f80a3515';

  describe('/cast-members/:id (PATCH)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const nestApp = startApp();
      const faker = CastMember.fake().one();
      const arrange = [
        {
          id: '96bdc41a-a41e-4e0b-ad96-ad66f80a3515',
          send_data: { name: faker.name },
          expected: {
            message:
              'CastMember with id(s) 96bdc41a-a41e-4e0b-ad96-ad66f80a3515 not found',
            statusCode: 404,
            error: 'Not found',
          },
        },
        {
          id: 'fake id',
          send_data: { name: faker.name },
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)(
        'when id is $id',
        async ({ id, send_data, expected }) => {
          return request(nestApp.app.getHttpServer())
            .patch(`/cast-members/${id}`)
            .send(send_data)
            .expect(expected.statusCode)
            .expect(expected);
        },
      );
    });

    describe('should a response error with 422 when request body is invalid', () => {
      const app = startApp();
      const invalidRequest = UpdateCastMemberFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));
      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .patch(`/cast-members/${uuid}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should a response error with 422 when throw EntityValidationError', () => {
      const app = startApp();
      const validationError =
        UpdateCastMemberFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(validationError).map((key) => ({
        label: key,
        value: validationError[key],
      }));
      let castMemberRepo: ICastMemberRepository;

      beforeEach(() => {
        castMemberRepo = app.app.get<ICastMemberRepository>(
          CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
      });
      test.each(arrange)('when body is $label', async ({ value }) => {
        const castMember = CastMember.fake().one().build();
        await castMemberRepo.insert(castMember);
        return request(app.app.getHttpServer())
          .patch(`/cast-members/${castMember.cast_member_id.id}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should update a cast member', () => {
      const app = startApp();
      const arrange = UpdateCastMemberFixture.arrangeForUpdate();
      let castMemberRepo: ICastMemberRepository;

      beforeEach(async () => {
        castMemberRepo = app.app.get<ICastMemberRepository>(
          CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
      });
      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const castMemberCreated = CastMember.fake().one().build();
          await castMemberRepo.insert(castMemberCreated);

          const res = await request(app.app.getHttpServer())
            .patch(`/cast-members/${castMemberCreated.cast_member_id.id}`)
            .send(send_data)
            .expect(200);
          const keyInResponse = UpdateCastMemberFixture.keysInResponse;
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);
          const id = res.body.data.id;
          const castMemberUpdated = await castMemberRepo.findById(new Uuid(id));
          const presenter = CastMembersController.serialize(
            CastMemberOutputMapper.toOutput(castMemberUpdated!),
          );
          const serialized = instanceToPlain(presenter);
          expect(res.body.data).toStrictEqual(serialized);
          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            name: expected.name ?? castMemberCreated.name,
            type: expected.type ?? castMemberCreated.type,
          });
        },
      );
    });
  });
});
