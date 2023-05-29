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
import { UserDTO } from '../../../company/DTO/UserDTO';
import {
  CreateUserPropsPrimitive,
  UpdateUserPropsPrimitive,
} from '../../../company/domain/entities/User';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('User')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  async findAll(@Res() res: Response): Promise<UserDTO[]> {
    const result = await this.service.listAllUser();

    if (result.isFailure()) {
      res.status(500).json({ error: result.error.message });
      return;
    }

    res
      .status(200)
      .send(result.data.map((User) => User.toDTO()))

    return
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<UserDTO> {
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
    @Body() data: CreateUserPropsPrimitive,
    @Res() res: Response,
  ): Promise<UserDTO> {
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
    @Body() data: UpdateUserPropsPrimitive,
    @Res() res: Response,
  ): Promise<UserDTO> {
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
