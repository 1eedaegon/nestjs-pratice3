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

// Evaluate -> call
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
    log(target);
    log(propertyKey);
    log(descriptor);
    const method = descriptor.value;

    descriptor.value = function () {
      try {
        method();
      } catch (err) {
        log(err);
      }
    };
  };
}

// class Greeter {
//   @HandleError()
//   hello() {
//     throw new Error('테스트 에러');
//   }
// }

// const t = new Greeter();
// t.hello();

// Accessor Decorator
function Enumerable(enumerable: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    descriptor.enumerable = enumerable;
  };
}

class Person {
  constructor(private name: string) {}

  @Enumerable(true)
  get getName() {
    return this.name;
  }

  @Enumerable(false)
  set setName(name: string) {
    this.name = name;
  }
}

const person = new Person('Dexter');
for (const key in person) {
  log(`${key}: ${person[key]}`);
}

// Property decorator
function format(formatString: string) {
  return function (target: any, propertyKey: string): any {
    let value = target[propertyKey];

    function getter() {
      return `${formatString} ${value}`;
    }

    function setter(newVal: string) {
      value = newVal;
    }
    return {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    };
  };
}

class Greeter {
  @format('Hello')
  greeting: string;
}

const t = new Greeter();
t.greeting = 'World';
log(t.greeting);

import { BadRequestException } from '@nestjs/common';

function MinLength(min: number) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    target.validators = {
      minLength: function (args: string[]) {
        return args[parameterIndex].length >= min;
      },
    };
  };
}

function Validate(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const method = descriptor.value;
  descriptor.value = function (...args) {
    Object.keys(target.validators).forEach((key) => {
      if (!target.validators[key](args)) {
        throw new BadRequestException();
      }
    });
    method.apply(this, args);
  };
}

class User {
  private name: string;

  @Validate
  setName(@MinLength(3) name: string) {
    this.name = name;
  }
}

const ts = new User();
ts.setName('Dexter');
ts.setName('hi');
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
