import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { CastMemberSequelizeRepository } from '../cast-member-sequelize.repository';
import { CastMemberModel } from '../cast-member.model';
import {
  CastMember,
  CastMemberId,
} from '@core/cast-member/domain/cast-member.aggregate';
import {
  CastMemberSearchParams,
  CastMemberSearchResult,
} from '@core/cast-member/domain/cast-member.repository';

describe('CastMemberSequelizeRepository Integration Tests', () => {
  let repository: CastMemberSequelizeRepository;
  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
  });

  it('should insert a new entity', async () => {
    const castMember = CastMember.fake().one().build();
    repository.insert(castMember);

    const savedEntity = await repository.findById(castMember.entity_id);
    expect(savedEntity).toStrictEqual(castMember);
  });

  it('should find an entity by id', async () => {
    const nonExistentEntity = await repository.findById(new CastMemberId());
    expect(nonExistentEntity).toBeNull();

    const entity = CastMember.fake().one().build();
    await repository.insert(entity);
    const savedEntity = await repository.findById(entity.entity_id);
    expect(savedEntity).toStrictEqual(entity);
  });

  it('should return all entities', async () => {
    const entities = CastMember.fake().many(5).build();
    await Promise.all(entities.map((entity) => repository.insert(entity)));

    const allEntities = await repository.findAll();
    expect(allEntities).toStrictEqual(entities);
  });

  it('should not let update a non existent entity', async () => {
    const entity = CastMember.fake().one().build();
    expect(async () => await repository.update(entity)).rejects.toThrow();
  });

  it('should update an entity', async () => {
    const entity = CastMember.fake().one().build();
    await repository.insert(entity);

    entity.changeName('new name');
    await repository.update(entity);

    const savedEntity = await repository.findById(entity.entity_id);
    expect(savedEntity).toStrictEqual(entity);
  });

  it('should not let delete a non existent entity', async () => {
    const entity = CastMember.fake().one().build();
    expect(() => repository.delete(entity.entity_id)).rejects.toThrow();
  });

  it('should delete an entity', async () => {
    const entity = CastMember.fake().one().build();
    await repository.insert(entity);

    await repository.delete(entity.entity_id);

    const deletedEntity = await repository.findById(entity.entity_id);
    expect(deletedEntity).toBeNull();
  });

  it('should bulk insert entities', async () => {
    const entities = CastMember.fake().many(5).build();
    await repository.bulkInsert(entities);

    const allEntities = await repository.findAll();
    expect(allEntities).toStrictEqual(entities);
  });

  describe('search', () => {
    it('should apply pagination and filter', async () => {
      const entities = [
        CastMember.fake()
          .one()
          .withName('test')
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        CastMember.fake()
          .one()
          .withName('TEST')
          .withCreatedAt(new Date(new Date().getTime() + 10000))
          .build(),
        CastMember.fake()
          .one()
          .withName('test')
          .withCreatedAt(new Date(new Date().getTime() + 15000))
          .build(),
        CastMember.fake()
          .one()
          .withName('a')
          .withCreatedAt(new Date(new Date().getTime() + 15000))
          .build(),
      ];

      await repository.bulkInsert(entities);

      const result = await repository.search(
        new CastMemberSearchParams({
          page: 1,
          per_page: 10,
          filter: { name: 'tEst' },
        }),
      );

      return expect(result).toStrictEqual(
        new CastMemberSearchResult({
          current_page: 1,
          items: [entities[2], entities[1], entities[0]],
          per_page: 10,
          total: 3,
        }),
      );
    });
  });
});
