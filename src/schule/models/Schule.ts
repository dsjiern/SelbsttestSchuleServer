import { Field, ObjectType } from '@nestjs/graphql';
import { UUID } from '../../global/scalars/UUID';
import { EmailAddress } from '../../global/scalars/EmailAddress'

@ObjectType()
export class Schule {
    @Field(() => UUID,{ nullable: false })
    _id: UUID

    @Field(() => String, { nullable: false })
    name: string

    @Field(() => String, { nullable: false })
    dienststelle: string

    @Field(() => String, { nullable: true })
    ansprechperson?: string

    @Field(() => EmailAddress, { nullable: true })
    email?: EmailAddress

    @Field(() => String, { nullable: true })
    telefon?: string

    @Field(() => String, { nullable: true })
    daten?: string
}