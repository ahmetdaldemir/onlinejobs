import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserController } from './user.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserInfo } from './entities/user-info.entity';
import { UserVerification } from './entities/user-verification.entity';
import { UserVerificationController } from './user-verification.controller';
import { UserVerificationService } from './user-verification.service';
import { Category } from '../categories/entities/category.entity';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInfo, UserVerification, Category]),
    UploadModule,
  ],
  controllers: [UsersController, UserController, UserVerificationController],
  providers: [UsersService, UserVerificationService],
  exports: [UsersService, UserVerificationService],
})
export class UsersModule {} 