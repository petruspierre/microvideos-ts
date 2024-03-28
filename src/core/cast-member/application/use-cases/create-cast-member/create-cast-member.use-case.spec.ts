import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { CreateCastMemberUseCase } from './create-cast-member.use-case';
import { CastMemberType } from '@core/cast-member/domain/cast-member.aggregate';
import { CreateCastMemberInput } from './create-cast-member.input';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';

describe('CreateCastMemberUseCase Unit Tests', () => {
  let useCase: CreateCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new CreateCastMemberUseCase(repository);
  });

  describe('execute', () => {
    it('should throw a generic error', async () => {
      const expectedError = new Error('generic error');
      jest.spyOn(repository, 'insert').mockRejectedValue(expectedError);
      await expect(
        useCase.execute({
          name: 'test',
          type: CastMemberType.ACTOR,
        }),
      ).rejects.toThrow(expectedError);
    });

    it('should throw an entity validation error', async () => {
      try {
        await useCase.execute(
          new CreateCastMemberInput({
            name: 'a'.repeat(256),
            type: CastMemberType.ACTOR,
          }),
        );
      } catch (e) {
        expect(e).toBeInstanceOf(EntityValidationError);
      }
      expect.assertions(1);
    });

    it('should create a cast member', async () => {
      const spyInsert = jest.spyOn(repository, 'insert');
      let output = await useCase.execute({
        name: 'test',
        type: CastMemberType.ACTOR,
      });
      expect(spyInsert).toHaveBeenCalledTimes(1);
      expect(output).toStrictEqual({
        id: repository.items[0].cast_member_id.id,
        name: 'test',
        type: CastMemberType.ACTOR,
        created_at: repository.items[0].created_at,
      });

      output = await useCase.execute({
        name: 'test',
        type: CastMemberType.DIRECTOR,
      });
      expect(spyInsert).toHaveBeenCalledTimes(2);
      expect(output).toStrictEqual({
        id: repository.items[1].cast_member_id.id,
        name: 'test',
        type: CastMemberType.DIRECTOR,
        created_at: repository.items[1].created_at,
      });
    });
  });
});
