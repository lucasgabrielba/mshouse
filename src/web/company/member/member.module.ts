import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { ORMMember } from '../../../infra/database/entities/ORMMember';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ORMMember])],
  providers: [MemberService],
  controllers: [MemberController],
})
export class MemberModule {}
