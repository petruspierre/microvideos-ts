import {
  CastMember,
  CastMemberId,
} from '@core/cast-member/domain/cast-member.aggregate';
import {
  CastMemberFilter,
  ICastMemberRepository,
} from '@core/cast-member/domain/cast-member.repository';
import { SortDirection } from '@core/shared/domain/repository/search-params';
import { InMemorySearchableRepository } from '@core/shared/infra/db/in-memory/in-memory.repository';

export class CastMemberInMemoryRepository
  extends InMemorySearchableRepository<
    CastMember,
    CastMemberId,
    CastMemberFilter
  >
  implements ICastMemberRepository
{
  sortableFields: string[] = ['created_at', 'name'];

  protected async applyFilter(
    items: CastMember[],
    filter: CastMemberFilter,
  ): Promise<CastMember[]> {
    if (!filter) {
      return Promise.resolve(items);
    }

    return items.filter((item) => {
      const hasName =
        !filter.name ||
        item.name.toLowerCase().includes(filter.name.toLowerCase());
      const hasType = !filter.type || item.type === filter.type;
      return hasName && hasType;
    });
  }

  getEntity(): new (...args: any[]) => CastMember {
    return CastMember;
  }

  protected applySort(
    items: CastMember[],
    sort: string,
    sort_dir: SortDirection,
  ): CastMember[] {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'created_at', sort_dir);
  }
}
