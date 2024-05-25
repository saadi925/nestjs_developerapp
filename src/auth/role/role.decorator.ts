import { SetMetadata } from '@nestjs/common';
import { $UserRole } from 'mongo/schema/user.schema';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: $UserRole[]) => SetMetadata(ROLES_KEY, roles);