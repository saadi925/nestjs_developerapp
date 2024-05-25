import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MEMBERSHIP_KEY } from '../membershipAuth/membership-auth.decorator';
import { User } from 'mongo/schema/user.schema';
import { $MemberShipType } from 'mongo/schema/membership.schema';

@Injectable()
export class MemberShipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredMemberships = this.reflector.getAllAndOverride<$MemberShipType[]>(MEMBERSHIP_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredMemberships) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest() as { user: User };

    // Check if the user's membership type matches any of the required membership types
    return requiredMemberships.some((membership) => user.membership.type === membership);
  }
}
