import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { User } from '../users/entities/user.entity';
import { Admin } from './entities/admin.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Admin]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, AdminAuthController],
  providers: [AuthService, AdminAuthService, JwtStrategy, AdminJwtStrategy],
  exports: [AuthService, AdminAuthService],
})
export class AuthModule {} 