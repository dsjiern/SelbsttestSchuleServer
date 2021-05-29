import { CustomScalar, Scalar } from '@nestjs/graphql';
import { GraphQLError, Kind, ValueNode } from 'graphql';

const validate = (value: string): string => {
  const EMAIL_ADDRESS_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (typeof value !== 'string') {
    throw new TypeError(`Value is not string: ${value}`);
  }

  if (!EMAIL_ADDRESS_REGEX.test(value)) {
    throw new TypeError(`Value is not a valid email address: ${value}`);
  }

  return value;
};

@Scalar('EmailAddress', () => EmailAddress)
export class EmailAddress implements CustomScalar<string, string> {
  description = 'A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/.'

  parseValue(value: string): string {
    return validate(value)
  }

  serialize(value: string): string {
    return validate(value)
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only validate strings as email addresses but got a: ${ast.kind}`,
      );
    }
    return validate(ast.value)
  }
}