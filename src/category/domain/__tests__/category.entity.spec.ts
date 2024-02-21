import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity"

describe('Category entity unit tests', () => {
  let validateSpy: jest.SpyInstance;
  beforeEach(() => {
    validateSpy = jest.spyOn(Category, 'validate');
  })

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
      expect(validateSpy).toHaveBeenCalledTimes(1);
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
      expect(validateSpy).toHaveBeenCalledTimes(1);
    })
  })

  test('changeName', () => {
    const category = new Category({
      name: 'Movie'
    });

    category.changeName('Movie 2');
    expect(category.name).toBe('Movie 2');
    expect(validateSpy).toHaveBeenCalledTimes(1);
  })

  test('changeDescription', () => {
    const category = new Category({
      name: 'Movie'
    });

    category.changeDescription('Movie category');
    expect(category.description).toBe('Movie category');
    expect(validateSpy).toHaveBeenCalledTimes(1);
  })

  test('activate', () => {
    const category = new Category({
      name: 'Movie',
      is_active: false
    });

    category.activate();
    expect(category.is_active).toBe(true);
    expect(validateSpy).toHaveBeenCalledTimes(0);
  })

  test('deactivate', () => {
    const category = new Category({
      name: 'Movie',
      is_active: true
    });

    category.deactivate();
    expect(category.is_active).toBe(false);
    expect(validateSpy).toHaveBeenCalledTimes(0);
  })
})

describe('Category validator', () => {
  describe('create command', () => {
    it('should throw when name is invalid', () => {
      expect(() => Category.create({
        name: null
      })).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters"
        ]
      })

      expect(() => Category.create({
        name: ''
      })).containsErrorMessages({
        name: [
          "name should not be empty"
        ]
      })

      expect(() => Category.create({
        name: 'a'.repeat(256)
      })).containsErrorMessages({
        name: [
          "name must be shorter than or equal to 255 characters"
        ]
      })
    })

    it('should throw when description is invalid', () => {
      expect(() => Category.create({
        name: 'Movie',
        description: 123 as any
      })).containsErrorMessages({
        description: [
          "description must be a string"
        ]
      })
    })

    it('should throw when is_active is invalid', () => {
      expect(() => Category.create({
        name: 'Movie',
        is_active: 123 as any
      })).containsErrorMessages({
        is_active: [
          "is_active must be a boolean value"
        ]
      })
    })
  })

  describe('changeName', () => {
    it('should throw when name is invalid', () => {
      const category = new Category({
        name: 'Movie'
      });

      expect(() => category.changeName(null)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters"
        ]
      })

      expect(() => category.changeName('')).containsErrorMessages({
        name: [
          "name should not be empty"
        ]
      })

      expect(() => category.changeName('a'.repeat(256))).containsErrorMessages({
        name: [
          "name must be shorter than or equal to 255 characters"
        ]
      })
    })
  })

  describe('changeDescription', () => {
    it('should throw when description is invalid', () => {
      const category = new Category({
        name: 'Movie'
      });

      expect(() => category.changeDescription(123 as any)).containsErrorMessages({
        description: [
          "description must be a string"
        ]
      })
    })
  })
})