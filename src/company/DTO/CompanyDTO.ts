import { AuditableDTO } from '../../../kernel/DTO/BaseDTO';
import { AddressDTO } from './AddressDTO';

export interface CompanyDTO extends AuditableDTO {
  id: string;
  name: string;
  phone: string;
  phone2?: string;
  phone3?: string;
  whatsapp: string;
  cnpj: string;
  email: string;
  email2?: string;
  email3?: string;
  site?: string;
  address?: AddressDTO;
}

export interface CompanyDTOPrimitive extends CompanyDTO {}
