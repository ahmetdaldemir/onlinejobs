import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        
        if (isProduction && configService.get('DATABASE_URL')) {
          // Production: Neon PostgreSQL
          return {
            type: 'postgres',
            url: configService.get('DATABASE_URL'),
            ssl: {
              rejectUnauthorized: false,
            },
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true, // Entity'lerden otomatik migrate
            logging: false,
          };
        } else {
          // Development: Local PostgreSQL
          return {
            type: 'postgres',
            host: configService.get('DATABASE_HOST', 'localhost'),
            port: configService.get('DATABASE_PORT', 5432),
            username: configService.get('DATABASE_USERNAME', 'postgres'),
            password: configService.get('DATABASE_PASSWORD', 'password123'),
            database: configService.get('DATABASE_NAME', 'onlinejobs'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true, // Entity'lerden otomatik migrate
            logging: configService.get('NODE_ENV') === 'development',
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {} 