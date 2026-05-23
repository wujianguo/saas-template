import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from "class-validator"

export function IsFutureDateString(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: "isFutureDateString",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (value == null) {
            return true
          }

          if (typeof value !== "string") {
            return false
          }

          return new Date(value).getTime() > Date.now()
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a future ISO 8601 date`
        },
      },
    })
  }
}
