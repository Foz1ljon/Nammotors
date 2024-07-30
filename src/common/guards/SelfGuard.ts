import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';

@Injectable()
export class SelfGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // So'rov kontekstini olish
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Ruxsatsiz kirish: token mavjud emas');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Ruxsatsiz kirish: token mavjud emas');
    }

    try {
      // Tokenni tekshirish va dekodlash
      const decodedToken = this.jwtService.verify(token, {
        secret: env.JWT_ACCESS_TOKEN,
      });

      if (!decodedToken) {
        throw new UnauthorizedException("Ruxsatsiz kirish: token noto'g'ri");
      }

      // Token dan foydalanuvchi id ni olish
      const userIdFromToken = decodedToken.id;

      // So'rovdagi id parametrini olish
      const idParam = req.params.id;
      if (userIdFromToken !== idParam) {
        throw new UnauthorizedException(
          'Ruxsatsiz kirish: sizga ruxsat berilmagan',
        );
      }

      // Agar hammasi to'g'ri bo'lsa, kirishga ruxsat berish
      return true;
    } catch (error) {
      throw new UnauthorizedException("Ruxsatsiz kirish: token noto'g'ri");
    }
  }
}
