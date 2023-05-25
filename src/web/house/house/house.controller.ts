import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { HouseDTO } from '../../../house/DTO/HouseDTO';
import {
  CreateHousePropsPrimitive,
  UpdateHousePropsPrimitive,
} from '../../../house/domain/entities/House';
import { HouseService } from './house.service';

@Controller('House')
export class HouseController {
  constructor(private readonly service: HouseService) {}

  @Get()
  async findAll(): Promise<HouseDTO[]> {
    const result = await this.service.listAllHouse();

    return result.data.map((House) => House.toDTO());
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<HouseDTO> {
    const result = await this.service.findOne(id);

    return result.data.toDTO();
  }

  @Post()
  async create(@Body() data: CreateHousePropsPrimitive): Promise<HouseDTO> {
    const result = await this.service.create(data);

    return result.data.toDTO();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateHousePropsPrimitive,
  ): Promise<HouseDTO> {
    const result = await this.service.update(id, data);

    return result.data.toDTO();
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    const result = await this.service.remove(id);

    return result.data;
  }
}
