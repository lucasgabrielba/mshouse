import { AuditableDTO } from '../../../kernel/DTO/BaseDTO';
import { UserType } from '../domain/enum/UserType';
import { CompanyDTO } from './CompanyDTO';

export interface UserDTO extends AuditableDTO {
  id: string;
  name: string;
  email: string;
  password: string;
  type: UserType;
  company: CompanyDTO;
}

export interface UserDTOPrimitive extends UserDTO {}
