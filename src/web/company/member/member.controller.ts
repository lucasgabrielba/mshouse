import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MemberDTO } from '../../../company/DTO/MemberDTO';
import {
  CreateMemberPropsPrimitive,
  UpdateMemberPropsPrimitive,
} from '../../../company/domain/entities/Member';
import { MemberService } from './member.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('member')
// @UseGuards(AuthGuard('jwt'))
export class MemberController {
  constructor(private readonly service: MemberService) {}

  @Get()
  async findAll(@Res() res: Response, @Req() req: any): Promise<MemberDTO[]> {
    const result = await this.service.listAllMember(req.member.type);

    if (result.isFailure()) {
      res
        .status(500)
        .json({ error: result.error.message });
      return;
    }

    res
      .status(200)
      .send(result.data.map((Member) => Member.toDTO()))

    return
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: any
  ): Promise<MemberDTO> {
    const result = await this.service.findOne(id, req.member.type);

    if (result.isFailure()) {
      res.json({ error: result.error.message });
      return;
    }

    res.status(200).send(result.data.toDTO())
    return
  }

  @Post()
  async create(
    @Body() data: CreateMemberPropsPrimitive,
    @Res() res: Response,
    @Req() req: any
  ): Promise<MemberDTO> {
    const createData = {
      ...data,
      companyId: data.companyId ?? req.member.companyId
    }
    const result = await this.service.create(createData);
    if (result.isFailure()) {
      res
        .status(400)
        .json({ error: result.error.message });
      return;
    }

    res
      .status(200)
      .send(result.data)
    return
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateMemberPropsPrimitive,
    @Res() res: Response,
    @Req() req: any
  ): Promise<MemberDTO> {

    const result = await this.service.update(id, data, req.member.type);

    if (result.isFailure()) {
      res
        .status(400)
        .json({ error: result.error.message });
      return;
    }

    res
      .status(200)
      .send(result.data.toDTO())
    return
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: any
  ): Promise<boolean> {

    const result = await this.service.delete(id, req.member.type);

    if (result.isFailure()) {
      res
        .status(400)
        .json({ error: result.error.message });
      return;
    }

    res.status(200).send(result.data)
    return
  }
}
