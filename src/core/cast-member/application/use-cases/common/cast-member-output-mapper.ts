import { CastMemberType } from '@core/cast-member/domain/cast-member.aggregate';

export type CastMemberOutput = {
  id: string;
  name: string;
  type: CastMemberType;
  created_at: Date;
};

export class CastMemberOutputMapper {
  static toOutput(entity: any): CastMemberOutput {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cast_member_id, ...otherProps } = entity.toJSON();
    return {
      id: entity.cast_member_id.id,
      ...otherProps,
    };
  }
}
