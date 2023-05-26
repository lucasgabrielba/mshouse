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
import { HouseDTO } from '../../../house/DTO/HouseDTO';
import {
  CreateHousePropsPrimitive,
  UpdateHousePropsPrimitive,
} from '../../../house/domain/entities/House';
import { HouseService } from './house.service';
import { Response } from 'express';

@Controller('house')
export class HouseController {
  constructor(private readonly service: HouseService) {}

  @Get()
  async findAll(@Res() res: Response): Promise<HouseDTO[]> {
    const result = await this.service.listAllHouse();

    if (result.isFailure()) {
      res.status(500).json({ error: result.error.message });
      return;
    }

    const allEntities: HouseDTO[] = []
    for (const house of result.data) {
      if (house) {
        allEntities.push(house.toDTO())
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
  ): Promise<HouseDTO> {
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
    @Body() data: CreateHousePropsPrimitive,
    @Res() res: Response,
  ): Promise<HouseDTO> {
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
    @Body() data: UpdateHousePropsPrimitive,
    @Res() res: Response,
  ): Promise<HouseDTO> {
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
