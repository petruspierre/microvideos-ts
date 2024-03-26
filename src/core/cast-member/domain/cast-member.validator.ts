import { MaxLength } from 'class-validator';
import { CastMember } from './cast-member.aggregate';
import { ClassValidatorFields } from '@core/shared/domain/validators/class-validator-fields';
import { Notification } from '@core/shared/domain/validators/notification';

class CastMemberRules {
  @MaxLength(255, { groups: ['name'] })
  name: string;

  constructor({ name, type }: CastMember) {
    Object.assign(this, { name, type });
  }
}

export class CastMemberValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    const newFields = fields?.length ? fields : ['name'];
    return super.validate(notification, new CastMemberRules(data), newFields);
  }
}

export class CastMemberValidatorFactory {
  static create() {
    return new CastMemberValidator();
  }
}
