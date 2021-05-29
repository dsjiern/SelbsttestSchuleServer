import { CustomScalar, Scalar } from '@nestjs/graphql';
import { GraphQLError, Kind, ValueNode } from 'graphql';

const validate = (value: string): string => {
  const UUID_REGEX = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$/;

  if (typeof value !== 'string') {
    throw new TypeError(`Value is not string: ${value}`);
  }

  if (!UUID_REGEX.test(value)) {
    throw new TypeError(`Value is not a valid UUID: ${value}`);
  }

  return value;
};

@Scalar('UUID', () => UUID)
export class UUID implements CustomScalar<string, string> {
  description = 'UUID'

  parseValue(value: string): string {
    return validate(value)
  }

  serialize(value: string): string {
    return validate(value)
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only validate strings as UUID but got a: ${ast.kind}`,
      );
    }
    return validate(ast.value)
  }
}