import { Injectable } from '@nestjs/common';
import { Result } from '../../../../kernel/Result/Result';
import { HouseApplicationService } from '../../../house/application/service/HouseApplicationService';
import {
  CreateHousePropsPrimitive,
  House,
  UpdateHousePropsPrimitive,
} from '../../../house/domain/entities/House';
import { HouseEntrypoint } from '../entrypoint/house.entrypoint';

@Injectable()
export class HouseService {
  protected applicationService: HouseApplicationService;

  constructor(entrypoint: HouseEntrypoint) {
    this.applicationService = entrypoint.getApplicationService();
  }

  async listAllHouse(): Promise<Result<House[]>> {
    const result = await this.applicationService.all();
    return result;
  }

  async findOne(id: string): Promise<Result<House>> {
    return await this.applicationService.getById(id);
  }

  async create(data: CreateHousePropsPrimitive): Promise<Result<House>> {
    return await this.applicationService.create(data);
  }

  async update(
    id: string,
    data: UpdateHousePropsPrimitive,
  ): Promise<Result<House>> {
    const entity = await this.applicationService.getById(id);

    if (entity.isFailure()) {
      return Result.fail(new Error(entity.error.toString()));
    }

    let HouseDTO = entity.data.toDTO();
    HouseDTO = {
      ...HouseDTO,
      ...data,
    };

    return await this.applicationService.update(HouseDTO);
  }

  async delete(id: string): Promise<Result<boolean>> {
    return await this.applicationService.remove(id);
  }
}
