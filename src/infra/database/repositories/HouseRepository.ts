import { Injectable } from '@nestjs/common';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ORMHouse } from '../entities/ORMHouse';
import { Result } from '../../../../kernel/Result/Result';
import { HouseRepositoryInterface } from '../../../house/domain/repository/HouseRepositoryInterface';
import { House } from '../../../house/domain/entities/House';

@Injectable()
export class HouseRepository
  extends Repository<ORMHouse>
  implements HouseRepositoryInterface {
  constructor(dataSource: DataSource) {
    super(ORMHouse, dataSource.createEntityManager());
  }

  async persist(instance: House): Promise<Result<void>> {
    try {
      await this.save(ORMHouse.import(instance));
      return Result.ok();
    } catch (e) {
      if (e instanceof QueryFailedError) {
        return Result.fail(new Error(e.message));
      }
      throw e;
    }
  }

  async findById(id: string): Promise<Result<House>> {
    const result = await this.findOne({
      where: { id: id.toString() },
    });
    if (!result) {
      return Result.fail(new Error('not found'));
    }

    return Result.ok<House>(result.export());
  }

  async findOneEntity(where: object): Promise<Result<House>> {
    try {
      const result = await this.findOne({ where });
      if (!result) {
        return Result.fail(new Error('not found'));
      }

      const House = result.export();
      return Result.ok(House);
    } catch (error) {
      return Result.fail(error);
    }
  }

  async findEntity(): Promise<Result<House[]>> {
    const result = await this.find();
    const results = result.map((House) => House.export());
    return Result.ok(results);
  }

  async deleteEntity(instance: House): Promise<Result<void>> {
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
