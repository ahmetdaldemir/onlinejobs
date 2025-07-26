declare const AdminJwtGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class AdminJwtGuard extends AdminJwtGuard_base {
    handleRequest(err: any, user: any, info: any): any;
}
export {};
