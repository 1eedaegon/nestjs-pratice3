import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { User } from './user';
import { UserFactory } from './user.factory';

describe('UserFactory', () => {
  let userFactory: UserFactory;
  let eventBus: jest.Mocked<EventBus>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: EventBus, useValue: { publish: jest.fn() } },
        UserFactory,
      ],
    }).compile();
    userFactory = module.get(UserFactory);
    eventBus = module.get(EventBus);
  });

  describe('create', () => {
    it('should create user', () => {
      // Given

      // When
      const user = userFactory.create(
        'user-id-xxxx',
        'Leedaegon',
        'd8726243@gmail.com',
        'sign-up-verify-token-sample',
        'p@s$w0rd',
      );
      // Then
      const expected = new User(
        'user-id-xxxx',
        'Leedaegon',
        'd8726243@gmail.com',
        'sign-up-verify-token-sample',
        'p@s$w0rd',
      );
      expect(expected).toEqual(user);
      expect(eventBus.publish).toBeCalledTimes(1);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute user', () => {
      // Given
      // When
      const user = userFactory.reconstitute(
        'user-id-xxxx',
        'Leedaegon',
        'd8726243@gmail.com',
        'sign-up-verify-token-sample',
        'p@s$w0rd',
      );
      // Then
      const expected = new User(
        'user-id-xxxx',
        'Leedaegon',
        'd8726243@gmail.com',
        'sign-up-verify-token-sample',
        'p@s$w0rd',
      );
      expect(expected).toEqual(user);
    });
  });
});
