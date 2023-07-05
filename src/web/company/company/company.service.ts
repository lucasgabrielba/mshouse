import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Result } from '../../../../kernel/Result/Result';
import { CompanyApplicationService } from '../../../company/application/service/CompanyApplicationService';
import {
  CreateCompanyPropsPrimitive,
  Company,
  UpdateCompanyPropsPrimitive,
} from '../../../company/domain/entities/Company';
import { CompanyEntrypoint } from '../entrypoint/company.entrypoint';
import { validatePermission } from '../../../../kernel/validatePermission/validatePermission';

@Injectable()
export class CompanyService {
  protected applicationService: CompanyApplicationService;

  constructor(entrypoint: CompanyEntrypoint) {
    this.applicationService = entrypoint.getApplicationService();
  }

  async listAllCompany(actor: string): Promise<Result<Company[]>> {
    const ismanager = validatePermission(actor)
    if (!ismanager) {
      return Result.fail(new UnauthorizedException('Voce não possui permissão'))
    }

    const result = await this.applicationService.all();
    return result;
  }

  async findOne(id: string, actor: string): Promise<Result<Company>> {
    const ismanager = validatePermission(actor)
    if (!ismanager) {
      return Result.fail(new UnauthorizedException('Voce não possui permissão'))
    }

    const result = await this.applicationService.getById(id);
    return result;
  }

  async create(data: CreateCompanyPropsPrimitive, actor: string): Promise<Result<Company>> {
    const ismanager = validatePermission(actor)
    if (!ismanager) {
      return Result.fail(new UnauthorizedException('Voce não possui permissão'))
    }

    const result = await this.applicationService.create(data);
    return result;
  }

  async update(
    id: string,
    data: UpdateCompanyPropsPrimitive,
    actor: string
  ): Promise<Result<Company>> {
    const ismanager = validatePermission(actor)
    if (!ismanager) {
      return Result.fail(new UnauthorizedException('Voce não possui permissão'))
    }

    const result = await this.applicationService.updateEntity(id, data);
    return result;
  }

  async delete(id: string, actor: string): Promise<Result<boolean>> {
    const ismanager = validatePermission(actor)
    if (!ismanager) {
      return Result.fail(new UnauthorizedException('Voce não possui permissão'))
    }

    const result = await this.applicationService.remove(id);
    return result;
  }

}