import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Test } from '../models/Test';
import { Schule } from '../../schule/models/Schule'
import {SchuleService} from '../../schule/schule.service'

@Resolver(() => Test)
export class TestResolver {
  @ResolveField(() => Schule, { nullable: true })
  async schule(
    @Parent() parent: Test
  ): Promise<Schule> {
    const service = new SchuleService();

    return {...await service.findOneById(parent._schule), daten: '', dienststelle: ''} as Schule;
  }
}