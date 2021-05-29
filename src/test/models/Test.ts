import { Field, ObjectType } from '@nestjs/graphql';
import { UUID } from '../../global/scalars/UUID';
import {DateTime} from '../../global/scalars/DateTime'

@ObjectType()
export class Test {
    @Field(() => UUID,{ nullable: false })
    _id: UUID

    @Field(() => String, { nullable: false })
    name: string

    @Field(() => DateTime, { nullable: false })
    zeitpunkt: DateTime

    @Field(() => UUID, { nullable: false })
    _schule: UUID
}