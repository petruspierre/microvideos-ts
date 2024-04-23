import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { CastMembersController } from '../cast-members.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../../database-module/database.module';
import { CAST_MEMBERS_PROVIDERS } from '../cast-members.providers';
import { CreateCastMemberUseCase } from '@core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case';
import { UpdateCastMemberUseCase } from '@core/cast-member/application/use-cases/update-cast-member/update-cast-member.use-case';
import { DeleteCastMemberUseCase } from '@core/cast-member/application/use-cases/delete-cast-member/delete-cast-member.use-case';
import { GetCastMemberUseCase } from '@core/cast-member/application/use-cases/get-cast-member/get-cast-member.use-case';
import { ListCastMembersUseCase } from '@core/cast-member/application/use-cases/list-cast-members/list-cast-members.use-case';
import { CastMembersModule } from '../cast-members.module';
import { ConfigModule } from '../../config-module/config.module';
import {
  CreateCastMemberFixture,
  ListCastMembersFixture,
  UpdateCastMemberFixture,
} from '../testing/cast-member-fixtures';
import {
  CastMember,
  CastMemberId,
} from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberOutputMapper } from '@core/cast-member/application/use-cases/common/cast-member-output-mapper';
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from '../cast-members.presenter';

describe('CastMemberController integration tests', () => {
  let controller: CastMembersController;
  let repository: ICastMemberRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CastMembersModule],
    }).compile();

    controller = module.get<CastMembersController>(CastMembersController);
    repository = module.get<ICastMemberRepository>(
      CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(CreateCastMemberUseCase);
    expect(controller['updateUseCase']).toBeInstanceOf(UpdateCastMemberUseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteCastMemberUseCase);
    expect(controller['getUseCase']).toBeInstanceOf(GetCastMemberUseCase);
    expect(controller['listUseCase']).toBeInstanceOf(ListCastMembersUseCase);
  });

  describe('should create a cast member', () => {
    const arrange = CreateCastMemberFixture.arrangeForCreate();

    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.create(send_data);
        const entity = await repository.findById(
          new CastMemberId(presenter.id),
        );
        expect(entity!.toJSON()).toStrictEqual({
          cast_member_id: presenter.id,
          created_at: presenter.created_at,
          ...expected,
        });
        const output = CastMemberOutputMapper.toOutput(entity);
        expect(presenter).toStrictEqual(new CastMemberPresenter(output));
      },
    );
  });

  describe('should update a cast member', () => {
    const arrange = UpdateCastMemberFixture.arrangeForUpdate();

    const castMember = CastMember.fake().one().build();

    beforeEach(async () => {
      await repository.insert(castMember);
    });

    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.update(
          castMember.cast_member_id.id,
          send_data,
        );
        const entity = await repository.findById(
          new CastMemberId(presenter.id),
        );
        expect(entity!.toJSON()).toStrictEqual({
          cast_member_id: presenter.id,
          created_at: presenter.created_at,
          ...expected,
        });
        const output = CastMemberOutputMapper.toOutput(entity);
        expect(presenter).toStrictEqual(new CastMemberPresenter(output));
      },
    );
  });

  it('should delete a cast member', async () => {
    const castMember = CastMember.fake().one().build();
    await repository.insert(castMember);

    const output = await controller.remove(castMember.cast_member_id.id);

    expect(output).toBeUndefined();
    const entity = await repository.findById(castMember.cast_member_id);
    expect(entity).toBeNull();
  });

  it('should get a cast member', async () => {
    const castMember = CastMember.fake().one().build();
    await repository.insert(castMember);

    const presenter = await controller.findOne(castMember.cast_member_id.id);

    expect(presenter.id).toBe(castMember.cast_member_id.id);
    expect(presenter.name).toBe(castMember.name);
    expect(presenter.type).toBe(castMember.type);
    expect(presenter.created_at).toStrictEqual(castMember.created_at);
  });

  describe('search method', () => {
    const { arrange, entities } =
      ListCastMembersFixture.arrangeIncrementedCreatedAt();

    beforeEach(async () => {
      await repository.bulkInsert(entities);
    });

    test.each(arrange)(
      'when send_data is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.search(send_data);
        const { entities, meta } = expected;
        expect(presenter).toStrictEqual(
          new CastMemberCollectionPresenter({
            items: entities.map(CastMemberOutputMapper.toOutput),
            ...meta,
          }),
        );
      },
    );
  });
});
