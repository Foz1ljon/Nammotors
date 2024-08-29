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
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!this.isValidAuthorizationHeader(authHeader)) {
      throw new UnauthorizedException('Ruxsatsiz kirish: token mavjud emas');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: env.JWT_ACCESS_TOKEN,
      });

      if (
        !decodedToken ||
        !this.isUserAuthorized(decodedToken.id, req.params.id)
      ) {
        throw new UnauthorizedException(
          'Ruxsatsiz kirish: sizga ruxsat berilmagan',
        );
      }

      return true;
    } catch {
      throw new UnauthorizedException("Ruxsatsiz kirish: token noto'g'ri");
    }
  }

  private isValidAuthorizationHeader(authHeader: string | undefined): boolean {
    return authHeader && authHeader.startsWith('Bearer ');
  }

  private isUserAuthorized(userIdFromToken: string, idParam: string): boolean {
    return userIdFromToken === idParam;
  }
}
