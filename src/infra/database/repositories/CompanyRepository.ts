import { Injectable } from '@nestjs/common';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ORMCompany } from '../entities/ORMCompany';
import { Result } from '../../../../kernel/Result/Result';
import { CompanyRepositoryInterface } from '../../../company/domain/repository/CompanyRepositoryInterface';
import { Company } from '../../../company/domain/entities/Company';

@Injectable()
export class CompanyRepository
  extends Repository<ORMCompany>
  implements CompanyRepositoryInterface {
  constructor(dataSource: DataSource) {
    super(ORMCompany, dataSource.createEntityManager());
  }

  async persist(instance: Company): Promise<Result<void>> {
    try {
      await this.save(ORMCompany.import(instance));
      return Result.ok();
    } catch (e) {
      if (e instanceof QueryFailedError) {
        return Result.fail(new Error(e.message));
      }
      throw e;
    }
  }

  async findById(id: string): Promise<Result<Company>> {
    const result = await this.findOne({
      where: { id: id.toString() },
    });
    if (!result) {
      return Result.fail(new Error('not found'));
    }

    return Result.ok<Company>(result.export());
  }

  async findOneEntity(where: object): Promise<Result<Company>> {
    try {
      const result = await this.findOne(where);
      if (!result) {
        return Result.fail(new Error('not found'));
      }

      const Company = result.export();
      return Result.ok(Company);
    } catch (error) {
      return Result.fail(error);
    }
  }

  async findEntity(): Promise<Result<Company[]>> {
    const result = await this.find();
    const results = result.map((Company) => Company.export());
    return Result.ok(results);
  }

  async deleteEntity(instance: Company): Promise<Result<void>> {
    try {
      const entity = await this.findOne({
        where: { id: instance.id },
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
