import { Injectable } from '@nestjs/common';
import { Schule } from './models/Schule';
import { Service } from '../global/service'

@Injectable()
export class SchuleService extends Service<Schule> {
  constructor() {
    super();
    this.collection = 'schule';
  }
}