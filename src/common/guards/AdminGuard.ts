import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import { Admin } from '../../admins/schemas/admin.schema';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized access token');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Unauthorized access token');
    }

    try {
      const user: Partial<Admin> = await this.jwtService.verify(token, {
        secret: env.ACCESS_TOKEN_KEY,
      });
      if (!user) throw new UnauthorizedException('Unauthorized access token');
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized access token');
    }
  }
}
