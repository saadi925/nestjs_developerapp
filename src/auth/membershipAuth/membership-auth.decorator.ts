import { SetMetadata } from '@nestjs/common';
import { $MemberShipType } from 'mongo/schema/membership.schema';

export const MEMBERSHIP_KEY = 'membership';
export const membership_type = (...memberships: $MemberShipType[]) =>
  SetMetadata(MEMBERSHIP_KEY, memberships);
