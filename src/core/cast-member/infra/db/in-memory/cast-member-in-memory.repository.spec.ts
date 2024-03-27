import {
  CastMember,
  CastMemberType,
} from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberInMemoryRepository } from './cast-member-in-memory.repository';

describe('CastMemberInMemoryRepository', () => {
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
  });

  describe('filter', () => {
    it('should not filter items when filter object is null', async () => {
      const items = [CastMember.fake().one().build()];
      const filterSpy = jest.spyOn(items, 'filter' as any);

      const itemsFiltered = await repository['applyFilter'](items, null);
      expect(filterSpy).not.toHaveBeenCalled();
      expect(itemsFiltered).toStrictEqual(items);
    });

    it('should filter items by name', async () => {
      const items = [
        CastMember.fake().one().withName('test').build(),
        CastMember.fake().one().withName('TEST').build(),
        CastMember.fake().one().withName('fake').build(),
      ];
      const filter = { name: 'TEST' };

      const itemsFiltered = await repository['applyFilter'](items, filter);
      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
    });

    it('should filter items by type', async () => {
      const items = [
        CastMember.fake().one().withType(CastMemberType.ACTOR).build(),
        CastMember.fake().one().withType(CastMemberType.DIRECTOR).build(),
      ];
      const filter = { type: CastMemberType.DIRECTOR };

      const itemsFiltered = await repository['applyFilter'](items, filter);
      expect(itemsFiltered).toStrictEqual([items[1]]);
    });

    it('should filter by name and type', async () => {
      const items = [
        CastMember.fake()
          .one()
          .withName('test')
          .withType(CastMemberType.ACTOR)
          .build(),
        CastMember.fake()
          .one()
          .withName('TEST')
          .withType(CastMemberType.DIRECTOR)
          .build(),
        CastMember.fake()
          .one()
          .withName('fake')
          .withType(CastMemberType.ACTOR)
          .build(),
      ];
      const filter = { name: 'TEST', type: CastMemberType.DIRECTOR };

      const itemsFiltered = await repository['applyFilter'](items, filter);
      expect(itemsFiltered).toStrictEqual([items[1]]);
    });
  });

  describe('sort', () => {
    it('should sort by created_at when sort param is null', async () => {
      const created_at = new Date();

      const items = [
        CastMember.fake()
          .one()
          .withName('test')
          .withCreatedAt(created_at)
          .build(),
        CastMember.fake()
          .one()
          .withName('TEST')
          .withCreatedAt(new Date(created_at.getTime() + 100))
          .build(),
        CastMember.fake()
          .one()
          .withName('fake')
          .withCreatedAt(new Date(created_at.getTime() + 200))
          .build(),
      ];

      const itemsSorted = await repository['applySort'](items, null, null);
      expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
    });

    it('should sort by name', async () => {
      const items = [
        CastMember.fake().one().withName('c').build(),
        CastMember.fake().one().withName('b').build(),
        CastMember.fake().one().withName('a').build(),
      ];

      let itemsSorted = await repository['applySort'](items, 'name', 'asc');
      expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

      itemsSorted = await repository['applySort'](items, 'name', 'desc');
      expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
    });
  });
});
