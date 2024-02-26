import { Entity } from "../../../../domain/entity";
import { NotFoundError } from "../../../../domain/errors/not-found.error";
import { ValueObject } from "../../../../domain/value-object";
import { Uuid } from "../../../../domain/value-objects/uuid.vo";
import { InMemoryRepository } from "../in-memory.repository";

type StubEntityProps = {
  entity_id?: Uuid;
  name: string;
  price: number;
}

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor(props: StubEntityProps) {
    super();

    this.entity_id = props.entity_id || new Uuid();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price
    }
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe('InMemoryRepositoyr unit tests', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  })

  test('should insert a new entity', async () => {
    const entity = new StubEntity({
      name: 'Stub entity',
      price: 100
    });

    await repository.insert(entity);

    expect(repository.items).toHaveLength(1);
    expect(repository.items[0]).toBe(entity);
  })

  test('should bulk insert entities', async () => {
    const entities = [
      new StubEntity({
        name: 'Stub entity 1',
        price: 100
      }),
      new StubEntity({
        name: 'Stub entity 2',
        price: 200
      })
    ];

    await repository.bulkInsert(entities);

    expect(repository.items).toHaveLength(2);
    expect(repository.items).toEqual(entities);
  })

  test('should find entity by id', async () => {
    const entity = new StubEntity({
      name: 'Stub entity',
      price: 100
    });

    await repository.insert(entity);

    const foundEntity = await repository.findById(entity.entity_id);

    expect(foundEntity).toBe(entity);
  })

  test('shoudl return null when entity is not found', async () => {
    const id = new Uuid();

    const foundEntity = await repository.findById(id);

    expect(foundEntity).toBeNull();
  })

  test('should update entity', async () => {
    const entity = new StubEntity({
      name: 'Stub entity',
      price: 100
    });

    await repository.insert(entity);

    entity.name = 'Updated entity';
    entity.price = 200;

    await repository.update(entity);

    const updatedEntity = await repository.findById(entity.entity_id);

    expect(updatedEntity).toBe(entity);
    expect(updatedEntity.name).toBe('Updated entity');
    expect(updatedEntity.price).toBe(200);
  })

  test('should throw NotFoundError when entity is not found', async () => {
    const entity = new StubEntity({
      name: 'Stub entity',
      price: 100
    });

    await expect(repository.update(entity)).rejects.toThrow(new NotFoundError(entity.entity_id, StubEntity));
  })

  test('should delete entity', async () => {
    const entity = new StubEntity({
      name: 'Stub entity',
      price: 100
    });

    await repository.insert(entity);

    await repository.delete(entity.entity_id);

    const foundEntity = await repository.findById(entity.entity_id);

    expect(foundEntity).toBeNull();
  })

  test('should throw NotFoundError when entity is not found', async () => {
    const id = new Uuid();

    await expect(repository.delete(id)).rejects.toThrow(new NotFoundError(id, StubEntity));
  })
})