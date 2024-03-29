import { CastMemberSequelizeRepository } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize.repository';
import { UpdateCastMemberUseCase } from './update-cast-member.use-case';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import {
  CastMember,
  CastMemberId,
  CastMemberType,
} from '@core/cast-member/domain/cast-member.aggregate';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

describe('UpdateCastMemberUseCase integration tests', () => {
  let useCase: UpdateCastMemberUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new UpdateCastMemberUseCase(repository);
  });

  it('should throw an error when entity not found', async () => {
    const uuid = new CastMemberId();
    await expect(() =>
      useCase.execute({ id: uuid.id, name: 'fake' }),
    ).rejects.toThrow(new NotFoundError(uuid.id, CastMember));
  });

  it('should update a cast member', async () => {
    const entity = CastMember.fake().one().build();
    repository.insert(entity);

    const output = await useCase.execute({
      id: entity.cast_member_id.id,
      name: 'test',
      type: CastMemberType.DIRECTOR,
    });
    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: 'test',
      type: CastMemberType.DIRECTOR,
      created_at: entity.created_at,
    });
  });
});
