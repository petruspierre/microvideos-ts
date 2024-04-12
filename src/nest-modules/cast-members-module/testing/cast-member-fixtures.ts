import {
  CastMember,
  CastMemberType,
} from '@core/cast-member/domain/cast-member.aggregate';

const _keysInResponse = ['id', 'name', 'type', 'created_at'];

export class GetCastMemberFixture {
  static keysInResponse = _keysInResponse;
}

export class CreateCastMemberFixture {
  static keysInResponse = _keysInResponse;

  static arrangeForCreate() {
    return [
      {
        send_data: {
          name: 'Ryan Gosling',
          type: CastMemberType.ACTOR,
        },
        expected: {
          name: 'Ryan Gosling',
          type: CastMemberType.ACTOR,
        },
      },
      {
        send_data: {
          name: 'Dennis Villeneuve',
          type: CastMemberType.DIRECTOR,
        },
        expected: {
          name: 'Dennis Villeneuve',
          type: CastMemberType.DIRECTOR,
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      EMPTY: {
        send_data: {},
        expected: {
          ...defaultExpected,
          message: [
            'name should not be empty',
            'name must be a string',
            'type must be one of the following values: 1, 2',
            'type should not be empty',
            'type must be a number conforming to the specified constraints',
          ],
        },
      },
      NAME_UNDEFINED: {
        send_data: {
          name: undefined,
          type: CastMemberType.ACTOR,
        },
        expected: {
          ...defaultExpected,
          message: ['name should not be empty', 'name must be a string'],
        },
      },
      NAME_NULL: {
        send_data: {
          name: null,
          type: CastMemberType.ACTOR,
        },
        expected: {
          ...defaultExpected,
          message: ['name should not be empty', 'name must be a string'],
        },
      },
      NAME_EMPTY: {
        send_data: {
          name: '',
          type: CastMemberType.ACTOR,
        },
        expected: {
          ...defaultExpected,
          message: ['name should not be empty'],
        },
      },
      TYPE_UNDEFINED: {
        send_data: {
          name: 'Ryan Gosling',
          type: undefined,
        },
        expected: {
          ...defaultExpected,
          message: [
            'type must be one of the following values: 1, 2',
            'type should not be empty',
            'type must be a number conforming to the specified constraints',
          ],
        },
      },
      TYPE_NULL: {
        send_data: {
          name: 'Ryan Gosling',
          type: null,
        },
        expected: {
          ...defaultExpected,
          message: [
            'type must be one of the following values: 1, 2',
            'type should not be empty',
            'type must be a number conforming to the specified constraints',
          ],
        },
      },
      TYPE_EMPTY: {
        send_data: {
          name: 'Ryan Gosling',
          type: '',
        },
        expected: {
          ...defaultExpected,
          message: [
            'type must be one of the following values: 1, 2',
            'type should not be empty',
            'type must be a number conforming to the specified constraints',
          ],
        },
      },
      TYPE_INVALID: {
        send_data: {
          name: 'Ryan Gosling',
          type: 3,
        },
        expected: {
          ...defaultExpected,
          message: ['type must be one of the following values: 1, 2'],
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      NAME_TOO_LONG: {
        send_data: {
          name: 'a'.repeat(256),
          type: CastMemberType.ACTOR,
        },
        expected: {
          ...defaultExpected,
          message: ['name must be shorter than or equal to 255 characters'],
        },
      },
    };
  }
}

export class UpdateCastMemberFixture {
  static keysInResponse = _keysInResponse;

  static arrangeForUpdate() {
    return [
      {
        send_data: {
          name: 'Ryan Gosling',
          type: CastMemberType.ACTOR,
        },
        expected: {
          name: 'Ryan Gosling',
          type: CastMemberType.ACTOR,
        },
      },
      {
        send_data: {
          name: 'Dennis Villeneuve',
          type: CastMemberType.DIRECTOR,
        },
        expected: {
          name: 'Dennis Villeneuve',
          type: CastMemberType.DIRECTOR,
        },
      },
      {
        send_data: {
          name: 'Tom Hanks',
        },
        expected: {
          name: 'Tom Hanks',
          type: CastMemberType.ACTOR,
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      TYPE_EMPTY: {
        send_data: {
          name: 'Ryan Gosling',
          type: '',
        },
        expected: {
          ...defaultExpected,
          message: [
            'type must be one of the following values: 1, 2',
            'type must be a number conforming to the specified constraints',
          ],
        },
      },
      TYPE_INVALID: {
        send_data: {
          name: 'Ryan Gosling',
          type: 'invalid',
        },
        expected: {
          ...defaultExpected,
          message: [
            'type must be one of the following values: 1, 2',
            'type must be a number conforming to the specified constraints',
          ],
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      NAME_TOO_LONG: {
        send_data: {
          name: 'a'.repeat(256),
        },
        expected: {
          ...defaultExpected,
          message: ['name must be shorter than or equal to 255 characters'],
        },
      },
    };
  }
}

export class ListCastMembersFixture {
  static arrangeIncrementedCreatedAt() {
    const entities = CastMember.fake()
      .many(4)
      .withName((index) => `Cast Member ${index}`)
      .withCreatedAt((index) => new Date(new Date().getTime() + index * 1000))
      .build();

    const arrange = [
      {
        send_data: {},
        expected: {
          entities: [entities[3], entities[2], entities[1], entities[0]],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
        },
        expected: {
          entities: [entities[3], entities[2]],
          meta: {
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
    ];

    return { arrange, entities };
  }
}
