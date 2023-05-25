import { RepositoryInterface } from '../../../../kernel/domain/repository/RepositoryInterface';
import { Employee } from '../entities/Employee';

export interface EmployeeRepositoryInterface
  extends RepositoryInterface<Employee> {}
