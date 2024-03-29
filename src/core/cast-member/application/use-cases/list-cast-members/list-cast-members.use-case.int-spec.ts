import { CastMemberSequelizeRepository } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize.repository';
import { ListCastMembersUseCase } from './list-cast-members.use-case';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberOutputMapper } from '../common/cast-member-output-mapper';

describe('ListCastMembersUseCase integration tests', () => {
  let useCase: ListCastMembersUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new ListCastMembersUseCase(repository);
  });

  it('should return output sorted by created_at when input param is empty', async () => {
    const items = CastMember.fake()
      .many(2)
      .withCreatedAt((index) => new Date(new Date().getTime() + index * 100))
      .build();
    await repository.bulkInsert(items);

    const output = await useCase.execute({});

    expect(output).toEqual({
      items: [...items].reverse().map(CastMemberOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should return output using pagination, sort and filter', async () => {
    const items = [
      CastMember.fake()
        .one()
        .withName('Ryan Renolds')
        .withCreatedAt(new Date(new Date().getTime() + 1000))
        .build(),
      CastMember.fake()
        .one()
        .withName('Ryan Gosling')
        .withCreatedAt(new Date(new Date().getTime() + 2000))
        .build(),
      CastMember.fake().one().withName('aaa').build(),
    ];

    await repository.bulkInsert(items);

    let output = await useCase.execute({
      filter: { name: 'ryan' },
      per_page: 1,
      sort: 'name',
      sort_dir: 'asc',
      page: 1,
    });

    expect(output).toEqual({
      items: [items[1]].map(CastMemberOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 1,
      last_page: 2,
    });

    output = await useCase.execute({
      filter: { name: 'ryan' },
      per_page: 1,
      sort: 'name',
      sort_dir: 'asc',
      page: 2,
    });

    expect(output).toEqual({
      items: [items[0]].map(CastMemberOutputMapper.toOutput),
      total: 2,
      current_page: 2,
      per_page: 1,
      last_page: 2,
    });
  });
});
