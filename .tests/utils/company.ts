import { Chance as generate } from 'chance';
import { CompanyDTO } from '../../src/company/DTO/CompanyDTO';
import { Company } from '../../src/company/domain/entities/Company';
import { ORMCompany } from '../../src/infra/database/entities/ORMCompany';

export const createCompanyDTO = (): Omit<CompanyDTO, 'id'> => {
  const createdAt = new Date();
  createdAt.setMilliseconds(0);

  const updatedAt = new Date();
  updatedAt.setMilliseconds(0);

  const deletedAt = new Date();
  updatedAt.setMilliseconds(0);

  return {
    name: generate().name(),
    phone: generate().phone(),
    phone2: generate().phone(),
    phone3: generate().phone(),
    email: generate().email(),
    email2: generate().email(),
    email3: generate().email(),
    site: generate().domain(),
    address: generate().address(),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    deletedAt: deletedAt.toISOString(),
  };
};

export const createCompany = (
  data?: Omit<CompanyDTO, 'id'>,
  id?: string,
): Company => {
  if (data && id) {
    const CompanyData = {
      ...data,
      id,
    };

    return Company.reconstitute(CompanyData).data;
  }
  data = data ?? createCompanyDTO();

  return Company.create(data).data;
};

export const createORMCompany = (company?: Company): ORMCompany => {
  const entity = new ORMCompany();

  if (company) {
    entity.id = company.id.toString();

    entity.name = company.name;
    entity.phone = company.phone;
    entity.phone2 = company.phone;
    entity.phone3 = company.phone;
    entity.email = company.email;
    entity.email2 = company.email;
    entity.email3 = company.email;
    entity.site = company.site;
    entity.address = company.address;

    entity.createdAt = company.createdAt;

    return entity;
  }

  entity.id = generate().guid({ version: 4 });

  entity.name = generate().name();
  entity.phone = generate().phone();
  entity.phone2 = generate().phone();
  entity.phone3 = generate().phone();
  entity.email = generate().email();
  entity.email2 = generate().email();
  entity.email3 = generate().email();
  entity.site = generate().domain();
  entity.address = generate().address();

  entity.createdAt = entity.createdAt = new Date();
  entity.updatedAt = new Date();
  entity.deletedAt = null;

  return entity;
};
