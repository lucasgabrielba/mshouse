import { Injectable } from '@nestjs/common';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ORMUser } from '../entities/ORMUser';
import { Result } from '../../../../kernel/Result/Result';
import { UserRepositoryInterface } from '../../../company/domain/repository/UserRepositoryInterface';
import { User } from '../../../company/domain/entities/User';

@Injectable()
export class UserRepository
  extends Repository<ORMUser>
  implements UserRepositoryInterface {
  constructor(dataSource: DataSource) {
    super(ORMUser, dataSource.createEntityManager());
  }

  async persist(instance: User): Promise<Result<void>> {
    try {
      await this.save(ORMUser.import(instance));
      return Result.ok();
    } catch (e) {
      if (e instanceof QueryFailedError) {
        return Result.fail(new Error(e.message));
      }
      throw e;
    }
  }

  async findById(id: string): Promise<Result<User>> {
    const result = await this.findOne({
      where: { id: id.toString() },
      relations: ['company'],
    });
    if (!result) {
      return Result.fail(new Error('not found'));
    }

    return Result.ok<User>(result.export());
  }

  async findOneEntity(where: object): Promise<Result<User>> {
    try {
      const result = await this.findOne({ where: where, relations: ['company'] });
      if (!result) {
        return Result.fail(new Error('not found'));
      }

      const User = result.export();
      return Result.ok(User);
    } catch (error) {
      return Result.fail(error);
    }
  }
  async findEntity(): Promise<Result<User[]>> {
    const result = await this.find({ relations: ['company'], });
    const results = result.map((User) => User.export());
    return Result.ok(results);
  }

  async deleteEntity(instance: User): Promise<Result<void>> {
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
