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
import { EmployeeDTO } from '../../../house/DTO/EmployeeDTO';
import {
  CreateEmployeePropsPrimitive,
  UpdateEmployeePropsPrimitive,
} from '../../../house/domain/entities/Employee';
import { EmployeeService } from './employee.service';
import { Response } from 'express';

@Controller('Employee')
export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  @Get()
  async findAll(@Res() res: Response): Promise<EmployeeDTO[]> {
    const result = await this.service.listAllEmployee();

    if (result.isFailure()) {
      res.status(500).json({ error: result.error.message });
      return;
    }

    res
      .status(200)
      .send(result.data.map((Employee) => Employee.toDTO()))

    return
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<EmployeeDTO> {
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
    @Body() data: CreateEmployeePropsPrimitive,
    @Res() res: Response,
  ): Promise<EmployeeDTO> {
    const result = await this.service.create(data);

    if (result.isFailure()) {
      res.json({ error: result.error.message });
      return;
    }

    res.status(200).send(result.data.toDTO())
    return
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateEmployeePropsPrimitive,
    @Res() res: Response,
  ): Promise<EmployeeDTO> {
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
