import { CastMemberType } from '@core/cast-member/domain/cast-member.aggregate';
import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

export type CreateCastMemberInputConstructorProps = {
  name: string;
  type: CastMemberType;
};

export class CreateCastMemberInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  type: CastMemberType;

  constructor(props: CreateCastMemberInputConstructorProps) {
    if (!props) return;
    this.name = props.name;
    this.type = props.type;
  }
}

export class ValidateCreateCastMemberInput {
  static validate(input: CreateCastMemberInput) {
    return validateSync(input);
  }
}
