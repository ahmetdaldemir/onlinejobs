"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const admin_auth_service_1 = require("./admin-auth.service");
const admin_auth_controller_1 = require("./admin-auth.controller");
const user_entity_1 = require("../users/entities/user.entity");
const admin_entity_1 = require("./entities/admin.entity");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const admin_jwt_strategy_1 = require("./strategies/admin-jwt.strategy");
const optional_auth_guard_1 = require("./guards/optional-auth.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, admin_entity_1.Admin]),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '7d' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController, admin_auth_controller_1.AdminAuthController],
        providers: [auth_service_1.AuthService, admin_auth_service_1.AdminAuthService, jwt_strategy_1.JwtStrategy, admin_jwt_strategy_1.AdminJwtStrategy, optional_auth_guard_1.OptionalAuthGuard],
        exports: [auth_service_1.AuthService, admin_auth_service_1.AdminAuthService, optional_auth_guard_1.OptionalAuthGuard, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map