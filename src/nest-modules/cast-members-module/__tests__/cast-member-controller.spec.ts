import { CreateCastMemberOutput } from '@core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case';
import { CastMembersController } from '../cast-members.controller';
import { CastMemberType } from '@core/cast-member/domain/cast-member.aggregate';
import { CreateCastMemberInput } from '@core/cast-member/application/use-cases/create-cast-member/create-cast-member.input';
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from '../cast-members.presenter';
import { UpdateCastMemberOutput } from '@core/cast-member/application/use-cases/update-cast-member/update-cast-member.use-case';
import { GetCastMemberOutput } from '@core/cast-member/application/use-cases/get-cast-member/get-cast-member.use-case';
import { UpdateCastMemberInput } from '@core/cast-member/application/use-cases/update-cast-member/update-cast-member.input';
import { ListCastMembersOutput } from '@core/cast-member/application/use-cases/list-cast-members/list-cast-members.use-case';
import { ListCastMembersInput } from '@core/cast-member/application/use-cases/list-cast-members/list-cast-member.input';

describe('CastMemberController unit tests', () => {
  let controller: CastMembersController;

  beforeEach(() => {
    controller = new CastMembersController();
  });

  it('should create a cast member', async () => {
    const output: CreateCastMemberOutput = {
      id: 'f0ddde95-9eee-4bcf-a558-c631a4caf7dc',
      name: 'Austin Butler',
      type: CastMemberType.ACTOR,
      created_at: new Date(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    };
    //@ts-expect-error defined part of methods
    controller['createUseCase'] = mockCreateUseCase;

    const input: CreateCastMemberInput = {
      name: 'Austin Butler',
      type: CastMemberType.ACTOR,
    };

    const presenter = await controller.create(input);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(new CastMemberPresenter(output));
  });

  it('should update a cast member', async () => {
    const id = 'f0ddde95-9eee-4bcf-a558-c631a4caf7dc';
    const output: UpdateCastMemberOutput = {
      id,
      name: 'Austin Butler',
      type: CastMemberType.ACTOR,
      created_at: new Date(),
    };

    const mockUpdateUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    };
    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;

    const input: Omit<UpdateCastMemberInput, 'id'> = {
      name: 'Austin Butler',
      type: CastMemberType.ACTOR,
    };

    const presenter = await controller.update(id, input);

    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(new CastMemberPresenter(output));
  });

  it('should delete a cast member', async () => {
    const mockDeleteUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    };
    //@ts-expect-error defined part of methods
    controller['deleteUseCase'] = mockDeleteUseCase;
    const id = 'f0ddde95-9eee-4bcf-a558-c631a4caf7dc';
    const output = await controller.remove(id);

    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(output).toBeUndefined();
  });

  it('should get a cast member', async () => {
    const id = 'f0ddde95-9eee-4bcf-a558-c631a4caf7dc';
    const output: GetCastMemberOutput = {
      id,
      name: 'Austin Butler',
      type: CastMemberType.ACTOR,
      created_at: new Date(),
    };

    const mockGetUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    };
    //@ts-expect-error defined part of methods
    controller['getUseCase'] = mockGetUseCase;

    const presenter = await controller.findOne(id);

    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(CastMemberPresenter);
    expect(presenter).toStrictEqual(new CastMemberPresenter(output));
  });

  it('should list cast members', async () => {
    const output: ListCastMembersOutput = {
      items: [
        {
          id: 'f0ddde95-9eee-4bcf-a558-c631a4caf7dc',
          name: 'Austin Butler',
          type: CastMemberType.ACTOR,
          created_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };

    const mockListUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    };
    //@ts-expect-error defined part of methods
    controller['listUseCase'] = mockListUseCase;
    const searchParams: ListCastMembersInput = {
      filter: {},
      page: 1,
      per_page: 1,
      sort: 'name',
      sort_dir: 'desc',
    };

    const presenter = await controller.search(searchParams);

    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toBeInstanceOf(CastMemberCollectionPresenter);
    expect(presenter).toStrictEqual(new CastMemberCollectionPresenter(output));
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
  });
});
