import { ValueObject } from '../value-object';

class StringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

describe('ValueObject unit tests', () => {
  describe('equals', () => {
    it('should return true if two value objects are equal', () => {
      const valueObject1 = new StringValueObject('test');
      const valueObject2 = new StringValueObject('test');

      expect(valueObject1.equals(valueObject2)).toBe(true);
    });

    it('should return false if two value objects are not equal', () => {
      const valueObject1 = new StringValueObject('test');
      const valueObject2 = new StringValueObject('test2');

      expect(valueObject1.equals(valueObject2)).toBe(false);
    });

    it('should return false if the value is null', () => {
      const valueObject1 = new StringValueObject('test');

      expect(valueObject1.equals(null as any)).toBe(false);
    });

    it('should return false if the value is undefined', () => {
      const valueObject1 = new StringValueObject('test');

      expect(valueObject1.equals(null as any)).toBe(false);
    });

    it('should return false if the value is a different type', () => {
      const valueObject1 = new StringValueObject('test');
      const valueObject2 = { value: 'test' };

      expect(valueObject1.equals(valueObject2 as StringValueObject)).toBe(
        false,
      );
    });
  });
});
