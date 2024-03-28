import { IUseCase } from '../../../../shared/application/use-case.interface';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';
import { CastMember } from '../../../domain/cast-member.aggregate';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../common/cast-member-output-mapper';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { CreateCastMemberInput } from './create-cast-member.input';

export class CreateCastMemberUseCase
  implements IUseCase<CreateCastMemberInput, CreateCastMemberOutput>
{
  constructor(private castMemberRepo: ICastMemberRepository) {}

  async execute(input: CreateCastMemberInput): Promise<CastMemberOutput> {
    const entity = CastMember.create(input);

    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }

    await this.castMemberRepo.insert(entity);
    return CastMemberOutputMapper.toOutput(entity);
  }
}

export type CreateCastMemberOutput = CastMemberOutput;
