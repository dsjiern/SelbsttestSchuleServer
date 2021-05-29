import { Module } from '@nestjs/common';
import { GraphQLModule} from '@nestjs/graphql';

import { GlobalModule } from './global/global.module';
import { SchuleModule } from './schule/schule.module';
import { TestModule } from './test/test.module'

@Module({
  imports: [
    GlobalModule,
    SchuleModule,
    TestModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: false,
      autoSchemaFile: 'schema.gql',
      debug: false,
      playground: false,
      resolvers: {},
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
