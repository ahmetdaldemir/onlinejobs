import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminJwtGuard extends AuthGuard('admin-jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Admin yetkisi gerekli');
    }
    
    // Admin kontrolü
    if (!user.isAdmin) {
      throw new UnauthorizedException('Admin yetkisi gerekli');
    }
    
    return user;
  }
} 