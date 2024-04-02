import { Transform } from 'class-transformer';
import { ListCastMembersOutput } from '../../core/cast-member/application/use-cases/list-cast-members/list-cast-members.use-case';
import { CastMemberType } from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberOutput } from '@core/cast-member/application/use-cases/common/cast-member-output-mapper';
import { CollectionPresenter } from '../shared-module/collection.presenter';

export class CastMemberPresenter {
  id: string;
  name: string;
  type: CastMemberType;
  @Transform(({ value }: { value: Date }) => {
    return value.toISOString();
  })
  created_at: Date;

  constructor(output: CastMemberOutput) {
    this.id = output.id;
    this.name = output.name;
    this.type = output.type;
    this.created_at = output.created_at;
  }
}

export class CastMemberCollectionPresenter extends CollectionPresenter {
  data: CastMemberPresenter[];

  constructor(output: ListCastMembersOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new CastMemberPresenter(item));
  }
}
