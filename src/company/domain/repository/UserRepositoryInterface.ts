import { RepositoryInterface } from '../../../../kernel/domain/repository/RepositoryInterface';
import { User } from '../entities/User';

export interface UserRepositoryInterface
  extends RepositoryInterface<User> {}
