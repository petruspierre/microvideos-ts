import { CastMemberSequelizeRepository } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize.repository';
import { DeleteCastMemberUseCase } from './delete-cast-member.use-case';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';
import { InvalidUuidError } from '@core/shared/domain/value-objects/uuid.vo';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

describe('DeleteCastMemberUseCase integration tests', () => {
  let useCase: DeleteCastMemberUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new DeleteCastMemberUseCase(repository);
  });

  it('should throw an error when the entity is not found', async () => {
    const id = 'fake id';
    await expect(useCase.execute({ id })).rejects.toThrow(InvalidUuidError);

    const uuid = '9d0c7636-2976-4225-90a8-1ff7478b034b';

    await expect(useCase.execute({ id: uuid })).rejects.toThrow(
      new NotFoundError(uuid, CastMember),
    );
  });

  it('should delete a cast member', async () => {
    const items = [CastMember.fake().one().build()];
    await repository.bulkInsert(items);

    await useCase.execute({
      id: items[0].cast_member_id.id,
    });

    const castMembers = await repository.findAll();
    expect(castMembers).toHaveLength(0);
  });
});
