import { CastMemberType } from '@core/cast-member/domain/cast-member.aggregate';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

export type UpdateCastMemberInputConstructorProps = {
  id: string;
  name?: string;
  type?: CastMemberType;
};

export class UpdateCastMemberInput {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsEnum(CastMemberType)
  @IsOptional()
  type?: CastMemberType;

  constructor(props?: UpdateCastMemberInputConstructorProps) {
    if (!props) return;
    this.id = props.id;
    this.name = props.name;
    this.type = props.type;
  }
}

export class ValidateUpdateCastMemberInput {
  static validate(input: UpdateCastMemberInput) {
    return validateSync(input);
  }
}
