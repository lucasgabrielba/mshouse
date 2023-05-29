import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ORMUser } from '../../../infra/database/entities/ORMUser';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ORMUser])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
