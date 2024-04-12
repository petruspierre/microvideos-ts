import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { UpdateCastMemberUseCase } from './update-cast-member.use-case';
import { InvalidUuidError } from '@core/shared/domain/value-objects/uuid.vo';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import {
  CastMember,
  CastMemberType,
} from '@core/cast-member/domain/cast-member.aggregate';

describe('UpdateCastMemberUseCase unit tests', () => {
  let useCase: UpdateCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new UpdateCastMemberUseCase(repository);
  });

  it('should throw an error when the entity is not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'fake id', name: 'test', type: 1 }),
    ).rejects.toThrow(InvalidUuidError);

    await expect(() =>
      useCase.execute({
        id: '9d0c7636-2976-4225-90a8-1ff7478b034b',
        name: 'test',
        type: 1,
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw an error when the aggregate is not valid', async () => {
    const aggregate = CastMember.fake().one().build();
    repository.items = [aggregate];

    await expect(() =>
      useCase.execute({
        id: aggregate.cast_member_id.id,
        name: 't'.repeat(256),
        type: aggregate.type,
      }),
    ).rejects.toThrow(EntityValidationError);
  });

  it('should update a cast member', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = CastMember.fake().one().build();
    repository.items = [entity];

    const output = await useCase.execute({
      id: entity.cast_member_id.id,
      name: 'test',
      type: CastMemberType.DIRECTOR,
    });

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: 'test',
      type: CastMemberType.DIRECTOR,
      created_at: entity.created_at,
    });
  });
});
