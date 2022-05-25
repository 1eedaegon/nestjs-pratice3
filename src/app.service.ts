import { Injectable } from '@nestjs/common';
import { first } from 'rxjs';

const { log } = console;
// Make function decorator
function firstDeco() {
  console.log('first(): factory evaluated');
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    log('firstDeco(): called');
  };
}

function secondDeco() {
  log('second(): factory evaluated');
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    log('secondDeco() called');
  };
}

class ExampleClass {
  @firstDeco()
  @secondDeco()
  test() {
    log('testing called');
  }
}

const e = new ExampleClass();
e.test();

function thirdDeco<T extends { new (...args: any[]): any }>(constructor: T) {
  return class extends constructor {
    reportingURL = 'http://www.example.com';
  };
}

@thirdDeco
class BugReport {
  type = 'report';
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}

const bug = new BugReport('Needs dark mode');
log(bug);
// Method decorator practice
function HandleError() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    log(target, propertyKey, descriptor);
    const method = descriptor.value;
  };
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
