import { FieldsErrors } from "./validator-fields-interface";

export class EntityValidationError extends Error {
  constructor(public error: FieldsErrors, message = 'Entity validation error') {
    super(message);
    this.name = 'EntityValidationError';
  }

  count() {
    return Object.keys(this.error).length;
  }
}