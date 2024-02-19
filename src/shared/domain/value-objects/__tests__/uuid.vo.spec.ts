import { InvalidUuidError, Uuid } from "../uuid.vo";
import { validate as uuidValidate } from "uuid";

describe("Uuid unit tests", () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, "validate");

  describe("constructor", () => {
    it("should throw an error if the id is not a valid UUID", () => {
      expect(() => new Uuid("invalid-uuid")).toThrow(InvalidUuidError);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    it("should not throw an error if the id is a valid UUID", () => {
      expect(() => new Uuid()).not.toThrow(InvalidUuidError);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    it("should generate a new UUID if no id is provided", () => {
      const uuid = new Uuid();
      expect(uuid.id).toBeDefined();
      expect(uuidValidate(uuid.id)).toBe(true);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    it("should use the provided id", () => {
      const id = "967d1371-96bd-4f22-bba0-934fbeee9122";
      const uuid = new Uuid(id);
      expect(uuid.id).toBe(id);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
