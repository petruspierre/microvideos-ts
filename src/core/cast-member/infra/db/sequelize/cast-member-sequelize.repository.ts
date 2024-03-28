import {
  CastMemberSearchParams,
  CastMemberSearchResult,
  ICastMemberRepository,
} from '@core/cast-member/domain/cast-member.repository';
import { Op, literal } from 'sequelize';
import { CastMemberModel } from './cast-member.model';
import { CastMemberModelMapper } from './cast-member-model-mapper';
import {
  CastMember,
  CastMemberId,
} from '@core/cast-member/domain/cast-member.aggregate';
import { SortDirection } from '@core/shared/domain/repository/search-params';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

export class CastMemberSequelizeRepository implements ICastMemberRepository {
  sortableFields: string[] = ['name', 'created_at'];

  orderBy = {
    mysql: {
      name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`), //ascii
    },
  };

  constructor(private castMemberModel: typeof CastMemberModel) {}

  async insert(entity: CastMember): Promise<void> {
    const model = CastMemberModelMapper.toModel(entity);
    await this.castMemberModel.create(model.toJSON());
  }

  async update(entity: CastMember): Promise<void> {
    const id = entity.cast_member_id.id;
    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    const modelToUpdate = CastMemberModelMapper.toModel(entity);
    this.castMemberModel.update(modelToUpdate.toJSON(), {
      where: { cast_member_id: id },
    });
  }

  async bulkInsert(entities: CastMember[]): Promise<void> {
    const modelsProps = entities.map((entity) =>
      CastMemberModelMapper.toModel(entity).toJSON(),
    );
    await this.castMemberModel.bulkCreate(modelsProps);
  }

  async delete(entity_id: CastMemberId): Promise<void> {
    const id = entity_id.id;
    const model = await this._get(id);

    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    await this.castMemberModel.destroy({ where: { cast_member_id: id } });
  }

  async findById(entity_id: CastMemberId): Promise<CastMember | null> {
    const model = await this._get(entity_id.id);
    if (!model) {
      return null;
    }
    return CastMemberModelMapper.toEntity(model);
  }

  async findAll(): Promise<CastMember[]> {
    const models = await this.castMemberModel.findAll();
    return models.map((model) => CastMemberModelMapper.toEntity(model));
  }

  async search(props: CastMemberSearchParams) {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;

    const where = props.filter
      ? {
          ...(props.filter.name && {
            name: {
              [Op.like]: `%${props.filter.name}%`,
            },
          }),
          ...(props.filter.type && { type: props.filter.type }),
        }
      : {};

    const { rows: models, count } = await this.castMemberModel.findAndCountAll({
      where,
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: this.formatSort(props.sort, props.sort_dir!) }
        : {
            order: [['created_at', 'desc']],
          }),
      offset,
      limit,
    });

    return new CastMemberSearchResult({
      items: models.map((model) => CastMemberModelMapper.toEntity(model)),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  private async _get(id: string) {
    return await this.castMemberModel.findByPk(id);
  }

  private formatSort(sort: string, sort_dir: SortDirection) {
    const dialect = this.castMemberModel.sequelize!.getDialect() as 'mysql';
    if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
      return this.orderBy[dialect][sort](sort_dir);
    }
    return [[sort, sort_dir]];
  }

  getEntity(): new (...args: any[]) => CastMember {
    return CastMember;
  }
}
