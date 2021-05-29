import { Module } from '@nestjs/common';
import { UUID } from './scalars/UUID';
import { EmailAddress } from './scalars/EmailAddress';
import { DateTime } from './scalars/DateTime'

@Module({
  providers: [
    UUID,
    EmailAddress,
    DateTime,
  ]
})
export class GlobalModule {}