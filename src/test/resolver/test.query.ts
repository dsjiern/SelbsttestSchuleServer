import { Args, Query, Resolver } from '@nestjs/graphql';
import { Test } from '../models/Test';
import { TestService } from '../test.service';
import { UUID } from '../../global/scalars/UUID';

@Resolver(() => Test)
export class TestQuery {
  constructor(
    private readonly service: TestService,
  ) {}

  @Query(() => Test, { nullable: true })
  async Test(
    @Args('id') id: UUID,
  ): Promise<Test> {
    return await this.service.findOneById(id) as Test;
  }
}
