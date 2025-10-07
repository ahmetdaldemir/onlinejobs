"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
let UploadService = class UploadService {
    constructor() {
        this.uploadPath = 'uploads';
        this.verificationPath = 'uploads/verifications';
        this.jobImagesPath = 'uploads/job-images';
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
        if (!fs.existsSync(this.verificationPath)) {
            fs.mkdirSync(this.verificationPath, { recursive: true });
        }
        if (!fs.existsSync(this.jobImagesPath)) {
            fs.mkdirSync(this.jobImagesPath, { recursive: true });
        }
    }
    getMulterConfig() {
        return {
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, this.uploadPath);
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const extension = path.extname(file.originalname);
                    cb(null, `profile-${uniqueSuffix}${extension}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (file.mimetype.startsWith('image/')) {
                    cb(null, true);
                }
                else {
                    cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
                }
            },
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        };
    }
    getVerificationMulterConfig() {
        return {
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, this.verificationPath);
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const extension = path.extname(file.originalname);
                    cb(null, `verification-${uniqueSuffix}${extension}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                const allowedMimeTypes = [
                    'application/pdf',
                    'image/jpeg',
                    'image/jpg',
                    'image/png',
                ];
                if (allowedMimeTypes.includes(file.mimetype)) {
                    cb(null, true);
                }
                else {
                    cb(new Error('Sadece PDF, JPG, PNG dosyaları yüklenebilir!'), false);
                }
            },
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        };
    }
    async deleteFile(filename) {
        const filePath = path.join(this.uploadPath, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    async deleteVerificationFile(filename) {
        const filePath = path.join(this.verificationPath, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    getFileUrl(filename) {
        const url = `/uploads/${filename}`;
        console.log('🔗 Dosya URL\'i oluşturuldu:', url);
        return url;
    }
    getVerificationFileUrl(filename) {
        const url = `/uploads/verifications/${filename}`;
        console.log('🔗 Verification dosya URL\'i oluşturuldu:', url);
        return url;
    }
    getJobImagesMulterConfig() {
        return {
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, this.jobImagesPath);
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const extension = path.extname(file.originalname);
                    cb(null, `job-${uniqueSuffix}${extension}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (file.mimetype.startsWith('image/')) {
                    cb(null, true);
                }
                else {
                    cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
                }
            },
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        };
    }
    async deleteJobImage(filename) {
        const filePath = path.join(this.jobImagesPath, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    getJobImageUrl(filename) {
        const url = `/uploads/job-images/${filename}`;
        console.log('🔗 Job image URL\'i oluşturuldu:', url);
        return url;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
//# sourceMappingURL=upload.service.js.map