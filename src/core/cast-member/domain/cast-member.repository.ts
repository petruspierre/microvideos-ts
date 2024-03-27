import { SearchParams } from '@core/shared/domain/repository/search-params';
import { SearchResult } from '@core/shared/domain/repository/search-result';
import {
  CastMember,
  CastMemberId,
  CastMemberType,
} from './cast-member.aggregate';
import { ISearchableRepository } from '@core/shared/domain/repository/repository-interface';

export type CastMemberFilter = {
  name?: string;
  type?: CastMemberType;
};
export class CastMemberSearchParams extends SearchParams<CastMemberFilter> {}
export class CastMemberSearchResult extends SearchResult<CastMember> {}

export interface ICastMemberRepository
  extends ISearchableRepository<
    CastMember,
    CastMemberId,
    CastMemberFilter,
    CastMemberSearchParams,
    CastMemberSearchResult
  > {}
