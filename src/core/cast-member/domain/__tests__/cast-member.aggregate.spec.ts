import {
  CastMember,
  CastMemberId,
  CastMemberType,
} from '../cast-member.aggregate';

describe('CastMember unit tests', () => {
  describe('constructor', () => {
    it('should assign all properties', () => {
      const id = new CastMemberId();
      const createdAt = new Date();
      const castMember = new CastMember({
        cast_member_id: id,
        name: 'Jim Carrey',
        type: CastMemberType.ACTOR,
        created_at: createdAt,
      });
      expect(castMember.cast_member_id).toBe(id);
      expect(castMember.entity_id).toBe(id);
      expect(castMember.name).toBe('Jim Carrey');
      expect(castMember.type).toBe(CastMemberType.ACTOR);
      expect(castMember.created_at).toBe(createdAt);
    });

    it('should assign default properties', () => {
      const castMember = new CastMember({
        name: 'Jim Carrey',
        type: CastMemberType.ACTOR,
      });
      expect(castMember.cast_member_id).toBeInstanceOf(CastMemberId);
      expect(castMember.name).toBe('Jim Carrey');
      expect(castMember.type).toBe(CastMemberType.ACTOR);
      expect(castMember.created_at).toBeInstanceOf(Date);
    });
  });

  describe('changeName', () => {
    it('should change the name', () => {
      const castMember = new CastMember({
        name: 'Jim Carrey',
        type: CastMemberType.ACTOR,
      });
      castMember.changeName('Tom Hanks');
      expect(castMember.name).toBe('Tom Hanks');
    });
  });

  describe('changeType', () => {
    it('should change the type', () => {
      const castMember = new CastMember({
        name: 'Jim Carrey',
        type: CastMemberType.ACTOR,
      });
      castMember.changeType(CastMemberType.DIRECTOR);
      expect(castMember.type).toBe(CastMemberType.DIRECTOR);
    });
  });
});
