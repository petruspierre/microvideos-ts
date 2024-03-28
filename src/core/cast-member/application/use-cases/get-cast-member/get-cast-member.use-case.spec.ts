import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { GetCastMemberUseCase } from './get-cast-member.use-case';
import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';

describe('GetCastMemberUseCase Unit Tests', () => {
  let useCase: GetCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new GetCastMemberUseCase(repository);
  });

  it('should throw an error when the entity is not found', () => {
    expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow();
  });

  it('should return a cast member', async () => {
    const entity = CastMember.fake().one().build();
    await repository.insert(entity);
    const spyFindById = jest.spyOn(repository, 'findById');
    const output = await useCase.execute({ id: entity.cast_member_id.id });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: entity.name,
      type: entity.type,
      created_at: entity.created_at,
    });
  });
});
