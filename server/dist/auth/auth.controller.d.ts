import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(req: any, _loginDto: LoginDto): Promise<{
        user: {
            id: number;
            username: string;
        };
        accessToken: string;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        user: {
            id: number;
            username: string;
        };
        accessToken: string;
    }>;
    getProfile(req: any): any;
}
