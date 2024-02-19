import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity"

describe('Category entity unit tests', () => {
  test('constructor', () => {
    let category = new Category({
      name: 'Movie'
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBeNull();
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);

    const date = new Date();
    category = new Category({
      name: 'Movie',
      description: 'Movie category',
      is_active: false,
      created_at: date
    })

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('Movie category');
    expect(category.is_active).toBe(false);
    expect(category.created_at).toBe(date);

    category = new Category({
      name: 'Movie 2',
      description: 'Movie category 2',
    })

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie 2');
    expect(category.description).toBe('Movie category 2');
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);
  })

  describe('category_id field', () => {
    const arrange = [
      { category_id: null },
      { category_id: new Uuid() },
      { category_id: undefined }
    ]
    test.each(arrange)('category_id = %j', ({ category_id }) => {
      const category = new Category({
        name: 'Movie',
        category_id: category_id as any
      })

      expect(category.category_id).toBeInstanceOf(Uuid);

      if(category_id instanceof Uuid) {
        expect(category.category_id).toBe(category_id);
      }
    })
  })

  describe('create command', () => {
    it('should create a category providing name', () => {
      const category = Category.create({
        name: 'Movie'
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    })

    it('should create a category with all inputs', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'Movie category',
        is_active: false
      })

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBe('Movie category');
      expect(category.is_active).toBe(false);
      expect(category.created_at).toBeInstanceOf(Date);
    })
  })

  test('changeName', () => {
    const category = new Category({
      name: 'Movie'
    });

    category.changeName('Movie 2');
    expect(category.name).toBe('Movie 2');
  })

  test('changeDescription', () => {
    const category = new Category({
      name: 'Movie'
    });

    category.changeDescription('Movie category');
    expect(category.description).toBe('Movie category');
  })

  test('activate', () => {
    const category = new Category({
      name: 'Movie',
      is_active: false
    });

    category.activate();
    expect(category.is_active).toBe(true);
  })

  test('deactivate', () => {
    const category = new Category({
      name: 'Movie',
      is_active: true
    });

    category.deactivate();
    expect(category.is_active).toBe(false);
  })
})