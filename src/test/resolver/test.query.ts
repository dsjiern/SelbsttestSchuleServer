import { Args, Query, Resolver } from '@nestjs/graphql';
import { Test } from '../models/Test';
import { TestService } from '../test.service';
import { UUID } from '../../global/scalars/UUID';
import {SchuleService} from '../../schule/schule.service'
import {HttpException} from '@nestjs/common'
import {checkPassword} from '../../generate'

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

  @Query(() => [Test], { nullable: true })
  async Tests(
    @Args('dienststelle', { type: () => String, nullable: false }) dienststelle: string,
    @Args('passwort', { type: () => String, nullable: false }) passwort: string,
  ): Promise<Test[]> {
    const s = new SchuleService();
    const tmp = await s.find({ dienststelle, unconfirmed: { $exists: false } });

    if (tmp.length === 0) throw new HttpException('Keine Schule gefunden', 404);
    if (tmp.length > 1) throw new HttpException('Mehrere Einträge gefunden', 404);

    if (!checkPassword(passwort, (tmp[0] as undefined as any).passwort)) {
      throw new HttpException('AccessDenied', 403);
    }

    return this.service.find({ _schule: tmp[0]._id });
  }
}
