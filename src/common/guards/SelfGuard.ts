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

    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized access token');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Unauthorized access token');
    }

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: env.ACCESS_TOKEN_KEY,
      });

      if (!decodedToken) {
        throw new UnauthorizedException('Unauthorized access token');
      }

      // Extract user id from decoded token
      const userIdFromToken = decodedToken.id;

      // Check if userIdFromToken matches the id parameter in the request
      const idParam = req.params.id;
      if (userIdFromToken !== idParam) {
        throw new UnauthorizedException('Unauthorized access');
      }

      // If everything is fine, grant access
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized access token');
    }
  }
}
