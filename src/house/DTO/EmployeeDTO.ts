import { AuditableDTO } from '../../../kernel/DTO/BaseDTO';
import { EmployeeType } from '../domain/enum/EmployeeType';
import { HouseDTO } from './HouseDTO';

export interface EmployeeDTO extends AuditableDTO {
  id: string;
  name: string;
  type: EmployeeType;
  house: HouseDTO;
}

export interface EmployeeDTOPrimitive extends EmployeeDTO {}
