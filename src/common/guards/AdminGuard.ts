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

    if (!this.isValidAuthorizationHeader(authHeader)) {
      throw new UnauthorizedException(
        "Ruxsatsiz kirish: token mavjud emas yoki noto'ri",
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const user: Partial<Admin> = await this.jwtService.verify(token, {
        secret: env.JWT_ACCESS_TOKEN,
      });
      return !!user; // Foydalanuvchi tasdiqlangan bo'lsa true qaytaradi
    } catch {
      throw new UnauthorizedException(
        "Ruxsatsiz kirish: token mavjud emas yoki noto'ri",
      );
    }
  }

  private isValidAuthorizationHeader(authHeader: string | undefined): boolean {
    return authHeader && authHeader.startsWith('Bearer ');
  }
}
