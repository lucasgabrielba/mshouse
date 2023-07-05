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
  UnauthorizedException,
} from '@nestjs/common';
import { CompanyDTO } from '../../../company/DTO/CompanyDTO';
import {
  CreateCompanyPropsPrimitive,
  UpdateCompanyPropsPrimitive,
} from '../../../company/domain/entities/Company';
import { CompanyService } from './company.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('company')
@UseGuards(AuthGuard('jwt'))
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Get()
  async findAll(@Res() res: Response, @Req() req: any): Promise<CompanyDTO[]> {
    const result = await this.service.listAllCompany(req.user.type);

    if (result.isFailure()) {
      res.status(400).json({ error: result.error.message });
      return;
    }

    const allEntities: CompanyDTO[] = []
    for (const company of result.data) {
      if (company) {
        allEntities.push(company.toDTO())
      }
    }

    res
      .status(200)
      .send(allEntities)

    return
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<CompanyDTO> {
    const result = await this.service.findOne(id, req.user.type);

    if (result.isFailure()) {
      res
        .status(400)
        .json({ error: result.error.message });
      return;
    }

    res.status(200).send(result.data.toDTO())
    return
  }

  @Post()
  async create(
    @Body() data: CreateCompanyPropsPrimitive,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<CompanyDTO> {

    const result = await this.service.create(data, req.user.type);

    if (result.isFailure()) {
      res
        .status(400)
        .json({ error: result.error.message });
      return;
    }
    res.status(200).send(result.data)
    return
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCompanyPropsPrimitive,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<CompanyDTO> {

    const result = await this.service.update(id, data, req.user.type);

    if (result.isFailure()) {
      res
        .status(400)
        .json({ error: result.error.message });
      return;
    }

    res.status(200).send(result.data.toDTO())
    return
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<boolean> {

    const result = await this.service.delete(id, req.user.type);

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
