import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
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

    if (!this.isValidAuthorizationHeader(authHeader)) {
      throw new UnauthorizedException('Foydalanuvchi avtorizatsiya qilinmagan');
    }

    const token = authHeader.split(' ')[1];

    try {
      const user: Partial<Admin> = await this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_TOKEN,
      });

      if (!user?.super) {
        throw new NotAcceptableException("Bunday huquqingiz yo'q");
      }

      return true;
    } catch (error) {
      console.error('Token Verification Error:', error);
      throw new NotAcceptableException("Bunday huquqingiz yo'q");
    }
  }

  private isValidAuthorizationHeader(authHeader: string | undefined): boolean {
    return authHeader && authHeader.startsWith('Bearer ');
  }
}
