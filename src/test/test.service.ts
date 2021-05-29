import { Injectable } from '@nestjs/common';
import { Test } from './models/Test';
import { Service } from '../global/service'

@Injectable()
export class TestService extends Service<Test> {
  constructor() {
    super();
    this.collection = 'test';
  }
}