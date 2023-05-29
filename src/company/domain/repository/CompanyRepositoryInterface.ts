import { RepositoryInterface } from '../../../../kernel/domain/repository/RepositoryInterface';
import { Company } from '../entities/Company';

export interface CompanyRepositoryInterface extends RepositoryInterface<Company> {}
