"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_controller_1 = require("./users.controller");
const user_controller_1 = require("./user.controller");
const users_service_1 = require("./users.service");
const user_entity_1 = require("./entities/user.entity");
const user_info_entity_1 = require("./entities/user-info.entity");
const user_verification_entity_1 = require("./entities/user-verification.entity");
const user_verification_controller_1 = require("./user-verification.controller");
const user_verification_service_1 = require("./user-verification.service");
const category_entity_1 = require("../categories/entities/category.entity");
const upload_module_1 = require("../upload/upload.module");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, user_info_entity_1.UserInfo, user_verification_entity_1.UserVerification, category_entity_1.Category]),
            upload_module_1.UploadModule,
        ],
        controllers: [users_controller_1.UsersController, user_controller_1.UserController, user_verification_controller_1.UserVerificationController],
        providers: [users_service_1.UsersService, user_verification_service_1.UserVerificationService],
        exports: [users_service_1.UsersService, user_verification_service_1.UserVerificationService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map