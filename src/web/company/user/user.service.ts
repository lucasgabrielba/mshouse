import { Injectable } from '@nestjs/common';
import {
  CreateUserPropsPrimitive,
  User,
  UpdateUserPropsPrimitive,
} from '../../../company/domain/entities/User';
import { UserApplicationService } from '../../../company/application/service/UserApplicationService';
import { Result } from '../../../../kernel/Result/Result';
import { UserEntrypoint } from '../entrypoint/user.entrypoint';

@Injectable()
export class UserService {
  protected applicationService: UserApplicationService;

  constructor(entrypoint: UserEntrypoint) {
    this.applicationService = entrypoint.getApplicationService();
  }

  async listAllUser(): Promise<Result<User[]>> {
    const result = await this.applicationService.all();

    return result;
  }

  async findOne(id: string): Promise<Result<User>> {
    return await this.applicationService.getById(id);
  }

  async create(data: CreateUserPropsPrimitive): Promise<Result<User>> {
    return await this.applicationService.create(data);
  }

  async update(
    id: string,
    data: UpdateUserPropsPrimitive,
  ): Promise<Result<User>> {
    return await this.applicationService.updateEntity(id, data);
  }

  async delete(id: string): Promise<Result<boolean>> {
    return await this.applicationService.remove(id);
  }
}
