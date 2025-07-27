import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { MessagesModule } from './messages/messages.module';
import { CategoriesModule } from './categories/categories.module';
import { LocationsModule } from './locations/locations.module';
import { SeedsModule } from './seeds/seeds.module';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'ep-ancient-shape-ae4pprsc-pooler.c-2.us-east-2.aws.neon.tech',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME || 'neondb_owner',
      password: process.env.DATABASE_PASSWORD || 'npg_xGi1IKws3Pzg',
      database: process.env.DATABASE_NAME || 'neondb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      ssl: true,
    }),
    AuthModule,
    UsersModule,
    JobsModule,
    MessagesModule,
    CategoriesModule,
    LocationsModule,
    SeedsModule,
    AdminModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 