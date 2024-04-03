import request from 'supertest';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { CAST_MEMBERS_PROVIDERS } from 'src/nest-modules/cast-members-module/cast-members.providers';
import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';

describe('CastMemberController (e2e)', () => {
  describe('/delete/:id (DELETE)', () => {
    const appHelper = startApp();

    describe('should respond with an error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '96bdc41a-a41e-4e0b-ad96-ad66f80a3515',
          expected: {
            message:
              'CastMember with id(s) 96bdc41a-a41e-4e0b-ad96-ad66f80a3515 not found',
            statusCode: 404,
            error: 'Not found',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(appHelper.app.getHttpServer())
          .delete(`/cast-members/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should delete a category with status 204', async () => {
      const repository = appHelper.app.get<ICastMemberRepository>(
        CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );
      const castMember = CastMember.fake().one().build();
      await repository.insert(castMember);

      await request(appHelper.app.getHttpServer())
        .delete(`/cast-members/${castMember.entity_id.id}`)
        .expect(204);

      await expect(
        repository.findById(castMember.entity_id),
      ).resolves.toBeNull();
    });
  });
});
