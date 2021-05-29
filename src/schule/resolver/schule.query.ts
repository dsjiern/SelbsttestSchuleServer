import { Args, Query, Resolver } from '@nestjs/graphql';
import { Schule } from '../models/Schule';
import { SchuleService } from '../schule.service';
import { HttpException } from '@nestjs/common';
import { UUID } from '../../global/scalars/UUID';
import { checkPassword } from '../../generate';

@Resolver(() => Schule)
export class SchuleQuery {
  constructor(
    private readonly service: SchuleService,
  ) {}

  @Query(() => Schule, { nullable: false })
  async Schule(
    @Args('id') id: UUID,
  ): Promise<Schule> {
    return await this.service.findOneById(id) as Schule;
  }

  @Query(() => Schule, { nullable: false })
  async Daten(
    @Args('dienststelle') dienststelle: string,
    @Args('passwort') passwort: string,
  ): Promise<Schule> {
    const tmp = await this.service.find({ dienststelle, unconfirmed: { $exists: false } });

    if (tmp.length === 0) throw new HttpException('Keine Schule gefunden', 404);
    if (tmp.length > 1) throw new HttpException('Mehrere Einträge gefunden', 404);

    if (!(await checkPassword(passwort, (tmp[0] as undefined as any).passwort))) {
      throw new HttpException('AccessDenied', 403);
    }

    return tmp[0];
  }
}
