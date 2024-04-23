import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { CastMemberModel } from '../cast-member.model';
import { CastMemberModelMapper } from '../cast-member-model-mapper';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { CastMemberType } from '@core/cast-member/domain/cast-member.aggregate';

describe('CastMemberModelMapper Integration Tests', () => {
  setupSequelize({ models: [CastMemberModel] });

  describe('toEntity', () => {
    it('should throw error when the category is invalid', () => {
      expect.assertions(2);
      const model = CastMemberModel.build({
        cast_member_id: '4615d0b5-60e1-4569-bddb-e3096416296e',
        name: 'a'.repeat(256),
        created_at: new Date(),
        type: CastMemberType.ACTOR,
      });

      try {
        CastMemberModelMapper.toEntity(model);
        fail(
          'The category is valid, but it needs to throw a EntityValidationError',
        );
      } catch (e) {
        expect(e).toBeInstanceOf(EntityValidationError);
        expect((e as EntityValidationError).error).toMatchObject([
          {
            name: ['name must be shorter than or equal to 255 characters'],
          },
        ]);
      }
    });

    it('should transform a category model to a category aggregate', () => {
      const created_at = new Date();
      const model = CastMemberModel.build({
        cast_member_id: '4615d0b5-60e1-4569-bddb-e3096416296e',
        name: 'some value',
        type: CastMemberType.ACTOR,
        created_at,
      });

      const aggregate = CastMemberModelMapper.toEntity(model);
      expect(aggregate.toJSON()).toStrictEqual({
        cast_member_id: '4615d0b5-60e1-4569-bddb-e3096416296e',
        name: 'some value',
        type: CastMemberType.ACTOR,
        created_at,
      });
    });
  });
});
