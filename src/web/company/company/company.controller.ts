import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
} from '@nestjs/common';
import { CompanyDTO } from '../../../company/DTO/CompanyDTO';
import {
  CreateCompanyPropsPrimitive,
  UpdateCompanyPropsPrimitive,
} from '../../../company/domain/entities/Company';
import { CompanyService } from './company.service';
import { Response } from 'express';

@Controller('company')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Get()
  async findAll(@Res() res: Response): Promise<CompanyDTO[]> {
    const result = await this.service.listAllCompany();

    if (result.isFailure()) {
      res.status(500).json({ error: result.error.message });
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
  ): Promise<CompanyDTO> {
    const result = await this.service.findOne(id);

    if (result.isFailure()) {
      res.json({ error: result.error.message });
      return;
    }

    res.status(200).send(result.data.toDTO())
    return
  }

  @Post()
  async create(
    @Body() data: CreateCompanyPropsPrimitive,
    @Res() res: Response,
  ): Promise<CompanyDTO> {
    const result = await this.service.create(data);

    if (result.isFailure()) {
      res.json({ error: result.error.message });
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
  ): Promise<CompanyDTO> {
    const result = await this.service.update(id, data);

    if (result.isFailure()) {
      res.json({ error: result.error.message });
      return;
    }

    res.status(200).send(result.data.toDTO())
    return
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<boolean> {
    const result = await this.service.delete(id);

    if (result.isFailure()) {
      res.json({ error: result.error.message });
      return;
    }

    res.status(200).send(result.data)
    return
  }
}
