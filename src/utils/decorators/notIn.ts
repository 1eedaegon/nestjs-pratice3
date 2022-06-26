import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function NotIn(property: string, validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'NotIn',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedvalue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedvalue === 'string' &&
            !relatedvalue.includes(value)
          );
        },
      },
    });
  };
}
