import { RepositoryInterface } from '../../../../kernel/domain/repository/RepositoryInterface';
import { Member } from '../entities/Member';

export interface MemberRepositoryInterface
  extends RepositoryInterface<Member> {}
