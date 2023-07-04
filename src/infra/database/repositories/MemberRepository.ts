import { Injectable } from '@nestjs/common';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ORMMember } from '../entities/ORMMember';
import { Result } from '../../../../kernel/Result/Result';
import { MemberRepositoryInterface } from '../../../company/domain/repository/MemberRepositoryInterface';
import { Member } from '../../../company/domain/entities/Member';

@Injectable()
export class MemberRepository
  extends Repository<ORMMember>
  implements MemberRepositoryInterface {
  constructor(dataSource: DataSource) {
    super(ORMMember, dataSource.createEntityManager());
  }

  async persist(instance: Member): Promise<Result<void>> {
    try {
      await this.save(ORMMember.import(instance));
      return Result.ok();
    } catch (e) {
      if (e instanceof QueryFailedError) {
        return Result.fail(new Error(e.message));
      }
      throw e;
    }
  }

  async findById(id: string): Promise<Result<Member>> {
    const result = await this.findOne({
      where: { id: id.toString() },
      relations: ['company'],
    });
    if (!result) {
      return Result.fail(new Error('not found'));
    }

    return Result.ok<Member>(result.export());
  }

  async findOneEntity(where: object): Promise<Result<Member>> {
    try {
      const result = await this.findOne({ where: where, relations: ['company'] });
      if (!result) {
        return Result.fail(new Error('not found'));
      }

      const Member = result.export();
      return Result.ok(Member);
    } catch (error) {
      return Result.fail(error);
    }
  }
  async findEntity(): Promise<Result<Member[]>> {
    const result = await this.find({ relations: ['company'], });
    const results = result.map((Member) => Member.export());
    return Result.ok(results);
  }

  async deleteEntity(instance: Member): Promise<Result<void>> {
    try {
      const entity = await this.findOne({
        where: { id: instance.id.toString() },
        relations: ['company'],
      });
      if (!entity) return Result.fail(new Error('invalid'));
      await this.softRemove(entity);
      return Result.ok<void>();
    } catch (e) {
      if (e instanceof QueryFailedError) {
        return Result.fail(new Error('invalid'));
      }
      throw e;
    }
  }
}
