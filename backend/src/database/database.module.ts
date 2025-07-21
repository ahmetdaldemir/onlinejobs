import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        
        if (databaseUrl) {
          // DATABASE_URL kullanarak bağlantı
          return {
            type: 'postgres',
            url: databaseUrl,
            ssl: {
              rejectUnauthorized: false,
            },
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true, // Entity'lerden otomatik migrate
            logging: configService.get('NODE_ENV') === 'development',
          };
        } else {
          // Fallback: Local PostgreSQL (DATABASE_URL yoksa)
          return {
            type: 'postgres',
            host: configService.get('DATABASE_HOST', 'localhost'),
            port: configService.get('DATABASE_PORT', 5432),
            username: configService.get('DATABASE_USERNAME', 'neondb_owner'),
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