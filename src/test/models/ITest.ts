import {Field, InputType} from '@nestjs/graphql'
import {EmailAddress} from '../../global/scalars/EmailAddress'

@InputType()
export class ITest {
  @Field(() => String, { nullable: false })
  name: string

  @Field(() => EmailAddress, { nullable: false })
  email: EmailAddress

  @Field(() => String, { nullable: true })
  geburtsdatum?: string
}