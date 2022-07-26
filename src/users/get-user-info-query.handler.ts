import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { GetUserInfoQuery } from './get-user-info.query';
import { UserInfo } from './user-info';

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoQueryHandler implements IQueryHandler {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async execute(query: GetUserInfoQuery): Promise<UserInfo> {
    const { userId } = query;
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User does not found.');
    }
    return { id: user.id, name: user.name, email: user.email };
  }
}
