import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Result } from '../../../../kernel/Result/Result';
import { MemberApplicationService } from '../../../company/application/service/MemberApplicationService';
import {
  CreateMemberPropsPrimitive,
  Member,
  UpdateMemberPropsPrimitive,
} from '../../../company/domain/entities/Member';
import { MemberEntrypoint } from '../entrypoint/member.entrypoint';
import { validatePermission } from '../../../../kernel/validatePermission/validatePermission';

@Injectable()
export class MemberService {
  protected applicationService: MemberApplicationService;

  constructor(entrypoint: MemberEntrypoint) {
    this.applicationService = entrypoint.getApplicationService();
  }

  async listAllMember(actor: string): Promise<Result<Member[]>> {
    const ismanager = validatePermission(actor)
    if (!ismanager) {
      return Result.fail(new UnauthorizedException('Voce não possui permissão'))
    }

    const result = await this.applicationService.all();
    return result;
  }

  async findOne(id: string, actor: string): Promise<Result<Member>> {
    const ismanager = validatePermission(actor)
    if (!ismanager) {
      return Result.fail(new UnauthorizedException('Voce não possui permissão'))
    }

    const result = await this.applicationService.getById(id);
    return result;
  }

  async create(data: CreateMemberPropsPrimitive, actor: string): Promise<Result<Member>> {
    const ismanager = validatePermission(actor)
    if (!ismanager) {
      return Result.fail(new UnauthorizedException('Voce não possui permissão'))
    }

    const result = await this.applicationService.create(data);
    return result;
  }

  async update(
    id: string,
    data: UpdateMemberPropsPrimitive,
    actor: string
  ): Promise<Result<Member>> {
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