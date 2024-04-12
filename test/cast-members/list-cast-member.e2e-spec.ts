import { CastMemberOutputMapper } from '@core/cast-member/application/use-cases/common/cast-member-output-mapper';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { instanceToPlain } from 'class-transformer';
import { CastMembersController } from 'src/nest-modules/cast-members-module/cast-members.controller';
import { CAST_MEMBERS_PROVIDERS } from 'src/nest-modules/cast-members-module/cast-members.providers';
import { ListCastMembersFixture } from 'src/nest-modules/cast-members-module/testing/cast-member-fixtures';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import request from 'supertest';

describe('CastMemberController (e2e)', () => {
  describe('/cast-members (GET)', () => {
    describe('should return cast members sorted by created_at when request query is empty', () => {
      let castMemberRepo: ICastMemberRepository;
      const nestApp = startApp();
      const { entities, arrange } =
        ListCastMembersFixture.arrangeIncrementedCreatedAt();

      beforeEach(async () => {
        castMemberRepo = nestApp.app.get<ICastMemberRepository>(
          CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
        await castMemberRepo.bulkInsert(entities);
      });

      test.each(arrange)(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          return request(nestApp.app.getHttpServer())
            .get(`/cast-members/?${queryParams}`)
            .expect(200)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(
                  CastMembersController.serialize(
                    CastMemberOutputMapper.toOutput(e),
                  ),
                ),
              ),
              meta: expected.meta,
            });
        },
      );
    });
  });
});
