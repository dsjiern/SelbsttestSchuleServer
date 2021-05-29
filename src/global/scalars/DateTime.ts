import { CustomScalar, Scalar } from '@nestjs/graphql';
import { GraphQLError, Kind, ValueNode } from 'graphql';

const validate = (value: string): string => {
  const DATE_REGEX = /^(18|19|20)\d{2}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01])( (0?[0-9]|1[0-9]|2[0-3]):(0?[0-9]|[1-5][0-9]):(0?[0-9]|[1-5][0-9]))?$/;

  if (typeof value !== 'string') {
    throw new TypeError(`Value is not string: ${value}`);
  }

  if (!DATE_REGEX.test(value)) {
    throw new TypeError(`Value is not a valid datetime: ${value}`);
  }

  const split = value.split(' ');
  if (split.length === 1) split.push('00:00:00');

  const tmp = split[0].split('-');
  if (tmp[1].length === 1) tmp[1] = '0' + tmp[1];
  if (tmp[2].length === 1) tmp[2] = '0' + tmp[2];
  split[0] = tmp.join('-');

  const time = split[1].split(':');
  if(time[0].length === 1) time[0] = '0' + time[0];
  if(time[1].length === 1) time[1] = '0' + time[1];
  if(time[2].length === 1) time[2] = '0' + time[2];
  split[1] = time.join(':');

  return split.join(' ');
};

@Scalar('DateTime', () => DateTime)
export class DateTime implements CustomScalar<string, string> {
  description = 'A datetime string YYYY-MM-DD HH:MM:SS'

  parseValue(value: string): string {
    return validate(value)
  }

  serialize(value: string): string {
    return validate(value)
  }

  parseLiteral(ast: ValueNode): string {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only validate strings as date but got a: ${ast.kind}`,
      );
    }
    return validate(ast.value)
  }
}