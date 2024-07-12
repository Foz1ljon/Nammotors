import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '../../admins/schemas/admin.schema';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('User unauthorized');

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token)
      throw new UnauthorizedException('User unauthorized');

    try {
      const user: Partial<Admin> = await this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_TOKEN,
      });

      if (!user || !user.super)
        throw new UnauthorizedException('Access denied');

      return true;
    } catch {
      throw new UnauthorizedException('User unauthorized');
    }
  }
}
