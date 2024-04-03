import request from 'supertest';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { CAST_MEMBERS_PROVIDERS } from 'src/nest-modules/cast-members-module/cast-members.providers';
import { CreateCastMemberFixture } from 'src/nest-modules/cast-members-module/testing/cast-member-fixtures';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import { CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberOutputMapper } from '@core/cast-member/application/use-cases/common/cast-member-output-mapper';
import { instanceToPlain } from 'class-transformer';
import { CastMembersController } from 'src/nest-modules/cast-members-module/cast-members.controller';

describe('CastMemberContorller (e2e)', () => {
  const appHelper = startApp();
  let castMemberRepository: ICastMemberRepository;

  beforeEach(async () => {
    castMemberRepository = appHelper.app.get<ICastMemberRepository>(
      CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
    );
  });

  describe('/cast-members (POST)', () => {
    describe('should return a response error when request body is invalid', () => {
      const invalidRequest = CreateCastMemberFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post('/cast-members')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should return a response error when invalid domain entity is provided', () => {
      const invalidRequest =
        CreateCastMemberFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post('/cast-members')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('create cast member', () => {
      const arrange = CreateCastMemberFixture.arrangeForCreate();

      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const res = await request(appHelper.app.getHttpServer())
            .post('/cast-members')
            .send(send_data)
            .expect(201);

          const keysInResponse = CreateCastMemberFixture.keysInResponse;
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);

          const { id } = res.body.data;
          const castMember = await castMemberRepository.findById(
            new CastMemberId(id),
          );

          const presenter = CastMembersController.serialize(
            CastMemberOutputMapper.toOutput(castMember),
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
