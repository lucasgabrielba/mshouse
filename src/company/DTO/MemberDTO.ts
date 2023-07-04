import { AuditableDTO } from '../../../kernel/DTO/BaseDTO';
import { MemberType } from '../domain/enum/MemberType';
import { CompanyDTO } from './CompanyDTO';

export interface MemberDTO extends AuditableDTO {
  id: string;
  name: string;
  email: string;
  password: string;
  type: MemberType;
  company: CompanyDTO;
  refresh_token: string;
}

export interface MemberDTOPrimitive extends MemberDTO {
  id: string;
  name: string;
  email: string;
  password: string;
  type: MemberType;
  companyId: string;
  refresh_token: string;
}
