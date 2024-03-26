import { Chance } from 'chance';
import { CastMemberFakeBuilder } from '../cast-member-fake.builder';
import { CastMember, CastMemberId, CastMemberType } from '../cast-member.aggregate';

describe('CastMemberFakerBuilder Unit tests', () => {
  describe('cast_member_id prop', () => {
    const fake = CastMemberFakeBuilder.one();

    test('should throw error when no "with" methods have been called', () => {
      expect(() => fake.cast_member_id).toThrow(
        new Error(
          "Property cast_member_id not have a factory, use 'with' methods",
        ),
      );
    });

    test('should be undefined if not provided', () => {
      expect(fake['_cast_member_id']).toBeUndefined();
    });

    test('withUuid with value', () => {
      const cast_member_id = new CastMemberId();
      const $this = fake.withUuid(cast_member_id);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(fake.cast_member_id).toBe(cast_member_id);
    });

    test('withUuid with factory', () => {
      const cast_member_id = new CastMemberId();
      fake.withUuid(() => cast_member_id);
      expect(fake.cast_member_id).toBe(cast_member_id);
    });
  });

  describe('name prop', () => {
    const fake = CastMemberFakeBuilder.one();

    test('should be a function', () => {
      expect(typeof fake['_name']).toBe('function');
    });

    test('should call the word method', () => {
      const chance = Chance();
      const name = chance.word();
      fake.withName(name);
      expect(fake.name).toBe(name);
    });

    test('should pass index to name factory', () => {
      let mockFactory = jest.fn(() => 'name');
      fake.withName(mockFactory);
      fake.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);

      const name = 'name';
      mockFactory = jest.fn(() => name);
      const fakeMany = CastMemberFakeBuilder.many(2);
      fakeMany.withName(mockFactory);
      const castMember = fakeMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(castMember[0].name).toBe(name);
      expect(castMember[1].name).toBe(name);
    });

    test('invalid name length', () => {
      const castMember = CastMemberFakeBuilder.one()
        .withInvalidNameTooLong()
        .build();
      expect(castMember.name).toHaveLength(256);
    });
  });

  describe('type prop', () => {
    test('should be default to actor', () => {
      const fake = CastMemberFakeBuilder.one();
      expect(fake.type).toBe(CastMemberType.ACTOR);
    });

    test('withType with value', () => {
      const fake = CastMemberFakeBuilder.one();
      const type = CastMemberType.DIRECTOR;
      fake.withType(type);
      expect(fake.type).toBe(type);
    });
  });

  describe('created_at prop', () => {
    const faker = CastMemberFakeBuilder.one();

    test('should throw error when any with methods has called', () => {
      const fakerC = CastMemberFakeBuilder.one();
      expect(() => fakerC.created_at).toThrow(
        new Error("Property created_at not have a factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_created_at']).toBeUndefined();
    });

    test('withCreatedAt with value', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker.created_at).toBe(date);
    });

    test('withCreatedAt with factory', () => {
      const date = new Date();
      faker.withCreatedAt(() => date);
      expect(faker.created_at).toBe(date);
    });
  });

  describe('build', () => {
    test('should return a single object', () => {
      const castMember = CastMemberFakeBuilder.one().build();
      expect(castMember).toBeInstanceOf(CastMember);
    });

    test('should return an array of objects', () => {
      const castMembers = CastMemberFakeBuilder.many(2).build();
      expect(castMembers).toHaveLength(2);
      expect(castMembers[0]).toBeInstanceOf(CastMember);
      expect(castMembers[1]).toBeInstanceOf(CastMember);
    });
  })
});
