import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import {
  CreateEmployeePropsPrimitive,
  UpdateEmployeePropsPrimitive,
} from '../../../house/domain/entities/Employee';
import { EmployeeService } from './employee.service';
import { EmployeeDTO } from '../../../house/DTO/EmployeeDTO';

@Controller('Employee')
export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  @Get()
  async findAll(): Promise<EmployeeDTO[]> {
    const result = await this.service.listAllEmployee();

    return result.data.map((Employee) => Employee.toDTO());
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EmployeeDTO> {
    const result = await this.service.findOne(id);

    return result.data.toDTO();
  }

  @Post()
  async create(
    @Body() data: CreateEmployeePropsPrimitive,
  ): Promise<EmployeeDTO> {
    const result = await this.service.create(data);

    return result.data.toDTO();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateEmployeePropsPrimitive,
  ): Promise<EmployeeDTO> {
    const result = await this.service.update(id, data);

    return result.data.toDTO();
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    const result = await this.service.delete(id);

    return result.data;
  }
}
