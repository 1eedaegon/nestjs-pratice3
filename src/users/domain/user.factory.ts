import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { UserCreatedEvent } from './user-created.event';
import { User } from './user';

// User 객체를 User domain의 constructor에서 생성하는 것이 맞지만,
// 객체를 constructor에서 생성하면 eventbus를 주입할 수 없다.
// Factory로 감싸서 provider로 제공한다.
@Injectable()
export class UserFactory {
  constructor(private eventBus: EventBus) {}
  create(
    id: string,
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ): User {
    const user = new User(id, name, email, password, signupVerifyToken);
    this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
    return user;
  }
}
