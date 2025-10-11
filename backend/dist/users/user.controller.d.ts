import { UsersService } from './users.service';
import { CompleteUserDto } from './dto/complete-user.dto';
export declare class UserController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMyCompleteProfile(req: any): Promise<any>;
    updateMyCompleteProfile(req: any, completeUserDto: CompleteUserDto): Promise<any>;
}
