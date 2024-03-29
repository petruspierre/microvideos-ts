import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { ListCastMembersUseCase } from './list-cast-members.use-case';
import { CastMemberSearchResult } from '@core/cast-member/domain/cast-member.repository';
import {
  CastMember,
  CastMemberType,
} from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberOutputMapper } from '../common/cast-member-output-mapper';

describe('ListCastMembersUseCase unit tests', () => {
  let useCase: ListCastMembersUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new ListCastMembersUseCase(repository);
  });

  test('toOutput method', () => {
    let result = new CastMemberSearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
    });
    let output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });

    const entity = CastMember.create({
      name: 'Ryan Renolds',
      type: CastMemberType.ACTOR,
    });
    result = new CastMemberSearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
    });

    output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [entity].map(CastMemberOutputMapper.toOutput),
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });

  it('should return output sorted by created_at when input param is empty', async () => {
    const items = CastMember.fake()
      .many(2)
      .withCreatedAt((index) => new Date(new Date().getTime() + index * 100))
      .build();
    repository.items = items;

    const output = await useCase.execute({});
    expect(output.items).toStrictEqual(
      [...items].reverse().map(CastMemberOutputMapper.toOutput),
    );
  });
});
