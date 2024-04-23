import {
  CastMemberFilter,
  CastMemberSearchParams,
  CastMemberSearchResult,
  ICastMemberRepository,
} from '@core/cast-member/domain/cast-member.repository';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@core/shared/application/pagination-output-mapper';
import { IUseCase } from '@core/shared/application/use-case.interface';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../common/cast-member-output-mapper';
import { ListCastMembersInput } from './list-cast-member.input';

export type ListCastMembersOutput = PaginationOutput<CastMemberOutput>;

export class ListCastMembersUseCase
  implements IUseCase<ListCastMembersInput, ListCastMembersOutput>
{
  constructor(private castMemberRepository: ICastMemberRepository) {}

  async execute(input: ListCastMembersInput): Promise<ListCastMembersOutput> {
    const params = new CastMemberSearchParams(input as any);
    const searchResult = await this.castMemberRepository.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: CastMemberSearchResult) {
    const { items: _items } = searchResult;
    const items = _items.map((i) => {
      return CastMemberOutputMapper.toOutput(i);
    });
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}
