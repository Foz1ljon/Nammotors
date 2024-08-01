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

    if (!authHeader) {
      throw new UnauthorizedException('Foydalanuvchi avtorizatsiya qilinmagan');
    }

    // Ensure the header starts with 'Bearer '
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Foydalanuvchi avtorizatsiya qilinmagan');
    }

    try {
      // Verify the token
      const user: Partial<Admin> = await this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_TOKEN,
      });

      if (!user?.super) {
        throw new NotAcceptableException("Bunday huquqingiz yo'q");
      }

      return true;
    } catch (error) {
      // Log the error to debug
      console.error('Token Verification Error:', error);

      throw new NotAcceptableException("Bunday huquqingiz yo'q");
    }
  }
}
