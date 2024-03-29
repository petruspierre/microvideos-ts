import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { DeleteCastMemberUseCase } from './delete-cast-member.use-case';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { InvalidUuidError } from '@core/shared/domain/value-objects/uuid.vo';
import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';

describe('DeleteCastMemberUseCase unit tests', () => {
  let useCase: DeleteCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new DeleteCastMemberUseCase(repository);
  });

  it('should throw an error when the entity is not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      InvalidUuidError,
    );

    await expect(() =>
      useCase.execute({ id: '9d0c7636-2976-4225-90a8-1ff7478b034b' }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should delete a category', async () => {
    const items = [CastMember.fake().one().build()];
    repository.items = items;

    await useCase.execute({
      id: items[0].cast_member_id.id,
    });

    expect(repository.items).toHaveLength(0);
  });
});
