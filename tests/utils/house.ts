import { Chance as chance } from 'chance';
import { HouseDTO } from '../../src/house/DTO/HouseDTO';
import { House } from '../../src/house/domain/entities/House';
import { ORMHouse } from '../../src/infra/database/entities/ORMHouse';

export const createHouseDTO = (): Omit<HouseDTO, 'id'> => {
  const createdAt = new Date();
  createdAt.setMilliseconds(0);

  const updatedAt = new Date();
  updatedAt.setMilliseconds(0);

  const deletedAt = new Date();
  updatedAt.setMilliseconds(0);

  return {
    name: chance().name(),
    phone: chance().phone(),
    phone2: chance().phone(),
    phone3: chance().phone(),
    email: chance().email(),
    email2: chance().email(),
    email3: chance().email(),
    site: chance().domain(),
    address: chance().address(),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    deletedAt: deletedAt.toISOString(),
  };
};

export const createHouse = (
  data?: Omit<HouseDTO, 'id'>,
  id?: string,
): House => {
  if (data && id) {
    const HouseData = {
      ...data,
      id,
    };

    return House.reconstitute(HouseData).data;
  }
  data = data ?? createHouseDTO();

  return House.create(data).data;
};

export const createORMHouse = (house?: House): ORMHouse => {
  const entity = new ORMHouse();

  if (house) {
    entity.id = house.id.toString();

    entity.name = house.name;
    entity.phone = house.phone;
    entity.phone2 = house.phone;
    entity.phone3 = house.phone;
    entity.email = house.email;
    entity.email2 = house.email;
    entity.email3 = house.email;
    entity.site = house.site;
    entity.address = house.address;

    entity.createdAt = house.createdAt;

    return entity;
  }

  entity.id = chance().guid({ version: 4 });

  entity.name = chance().name();
  entity.phone = chance().phone();
  entity.phone2 = chance().phone();
  entity.phone3 = chance().phone();
  entity.email = chance().email();
  entity.email2 = chance().email();
  entity.email3 = chance().email();
  entity.site = chance().domain();
  entity.address = chance().address();

  entity.createdAt = entity.createdAt = new Date();
  entity.updatedAt = new Date();
  entity.deletedAt = null;

  return entity;
};
