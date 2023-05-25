import { AuditableDTO } from '../../../kernel/DTO/BaseDTO';
import { EmployeeType } from '../domain/enum/EmployeeType';

export interface EmployeeDTO extends AuditableDTO {
  id: string;
  name: string;
  type: EmployeeType;
}

export interface EmployeeDTOPrimitive extends EmployeeDTO {}
