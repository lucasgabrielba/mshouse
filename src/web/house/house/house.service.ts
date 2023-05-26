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
    const result = await this.applicationService.getById(id);
    return result;
  }

  async create(data: CreateHousePropsPrimitive): Promise<Result<House>> {
    const result = await this.applicationService.create(data);
    return result;
  }

  async update(
    id: string,
    data: UpdateHousePropsPrimitive,
  ): Promise<Result<House>> {
    const result = await this.applicationService.updateEntity(id, data);
    return result;
  }

  async delete(id: string): Promise<Result<boolean>> {
    const result = await this.applicationService.remove(id);
    return result;
  }
}
