import { Injectable } from '@nestjs/common';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ORMEmployee } from '../entities/ORMEmployee';
import { Result } from '../../../../kernel/Result/Result';
import { EmployeeRepositoryInterface } from '../../../house/domain/repository/EmployeeRepositoryInterface';
import { Employee } from '../../../house/domain/entities/Employee';

@Injectable()
export class EmployeeRepository
  extends Repository<ORMEmployee>
  implements EmployeeRepositoryInterface {
  constructor(dataSource: DataSource) {
    super(ORMEmployee, dataSource.createEntityManager());
  }

  async persist(instance: Employee): Promise<Result<void>> {
    try {
      await this.save(ORMEmployee.import(instance));
      return Result.ok();
    } catch (e) {
      if (e instanceof QueryFailedError) {
        return Result.fail(new Error(e.message));
      }
      throw e;
    }
  }

  async findById(id: string): Promise<Result<Employee>> {
    const result = await this.findOne({
      where: { id: id.toString() },
      relations: ['house'],
    });
    if (!result) {
      return Result.fail(new Error('not found'));
    }

    return Result.ok<Employee>(result.export());
  }

  async findOneEntity(where: object): Promise<Result<Employee>> {
    try {
      const result = await this.findOne({ where: where, relations: ['house'] });
      if (!result) {
        return Result.fail(new Error('not found'));
      }

      const Employee = result.export();
      return Result.ok(Employee);
    } catch (error) {
      return Result.fail(error);
    }
  }
  async findEntity(): Promise<Result<Employee[]>> {
    const result = await this.find({ relations: ['house'], });
    const results = result.map((Employee) => Employee.export());
    return Result.ok(results);
  }

  async deleteEntity(instance: Employee): Promise<Result<void>> {
    try {
      const entity = await this.findOne({
        where: { id: instance.id.toString() },
        relations: ['house'],
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
