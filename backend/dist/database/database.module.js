"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const databaseUrl = configService.get('DATABASE_URL');
                    if (databaseUrl) {
                        return {
                            type: 'postgres',
                            url: databaseUrl,
                            ssl: {
                                rejectUnauthorized: false,
                            },
                            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                            synchronize: true,
                            logging: configService.get('NODE_ENV') === 'development',
                        };
                    }
                    else {
                        return {
                            type: 'postgres',
                            host: configService.get('DATABASE_HOST', 'localhost'),
                            port: configService.get('DATABASE_PORT', 5432),
                            username: configService.get('DATABASE_USERNAME', 'neondb_owner'),
                            password: configService.get('DATABASE_PASSWORD', 'password123'),
                            database: configService.get('DATABASE_NAME', 'onlinejobs'),
                            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                            synchronize: true,
                            logging: configService.get('NODE_ENV') === 'development',
                        };
                    }
                },
                inject: [config_1.ConfigService],
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map