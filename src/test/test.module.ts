import { Module } from '@nestjs/common';
import { TestQuery } from './resolver/test.query';
import { TestMutation } from './resolver/test.mutation';
import { TestService } from './test.service';
import { TestResolver } from './resolver/test';

@Module({
  providers: [
    TestQuery, TestMutation,
    TestService,
    TestResolver,
  ],
})
export class TestModule {}