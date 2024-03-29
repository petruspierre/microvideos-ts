import { CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { IUseCase } from '@core/shared/application/use-case.interface';

export type DeleteCastMemberInput = {
  id: string;
};

export type DeleteCastMemberOutput = void;

export class DeleteCastMemberUseCase
  implements IUseCase<DeleteCastMemberInput, DeleteCastMemberOutput>
{
  constructor(private castMemberRepository: ICastMemberRepository) {}

  async execute(input: DeleteCastMemberInput): Promise<DeleteCastMemberOutput> {
    const id = new CastMemberId(input.id);
    await this.castMemberRepository.delete(id);
  }
}
