import { AuditableDTO } from '../../../kernel/DTO/BaseDTO';

export interface HouseDTO extends AuditableDTO {
  id: string;
  name: string;
  phone: string;
  phone2?: string;
  phone3?: string;
  email: string;
  email2?: string;
  email3?: string;
  site?: string;
  address?: string;
}

export interface HouseDTOPrimitive extends HouseDTO {}
