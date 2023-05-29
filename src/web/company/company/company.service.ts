import { Injectable } from '@nestjs/common';
import { Result } from '../../../../kernel/Result/Result';
import { CompanyApplicationService } from '../../../company/application/service/CompanyApplicationService';
import {
  CreateCompanyPropsPrimitive,
  Company,
  UpdateCompanyPropsPrimitive,
} from '../../../company/domain/entities/Company';
import { CompanyEntrypoint } from '../entrypoint/company.entrypoint';

@Injectable()
export class CompanyService {
  protected applicationService: CompanyApplicationService;

  constructor(entrypoint: CompanyEntrypoint) {
    this.applicationService = entrypoint.getApplicationService();
  }

  async listAllCompany(): Promise<Result<Company[]>> {
    const result = await this.applicationService.all();
    return result;
  }

  async findOne(id: string): Promise<Result<Company>> {
    const result = await this.applicationService.getById(id);
    return result;
  }

  async create(data: CreateCompanyPropsPrimitive): Promise<Result<Company>> {
    const result = await this.applicationService.create(data);
    return result;
  }

  async update(
    id: string,
    data: UpdateCompanyPropsPrimitive,
  ): Promise<Result<Company>> {
    const result = await this.applicationService.updateEntity(id, data);
    return result;
  }

  async delete(id: string): Promise<Result<boolean>> {
    const result = await this.applicationService.remove(id);
    return result;
  }
}
