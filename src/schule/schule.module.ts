import { Module } from '@nestjs/common';
import { SchuleQuery } from './resolver/schule.query';
import { SchuleMutation } from './resolver/schule.mutation';
import { SchuleService } from './schule.service';

@Module({
  providers: [
    SchuleQuery, SchuleMutation,
    SchuleService,
  ],
})
export class SchuleModule {}