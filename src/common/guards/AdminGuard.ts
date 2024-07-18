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
      throw new UnauthorizedException('Unauthorized access token1');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Unauthorized access token2');
    }

    try {
      const user: Partial<Admin> = await this.jwtService.verify(token, {
        secret: env.JWT_ACCESS_TOKEN,
      });
      if (!user) throw new UnauthorizedException('Unauthorized access token3');
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized access token4');
    }
  }
}
