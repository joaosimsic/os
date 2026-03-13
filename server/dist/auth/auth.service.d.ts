import { JwtService } from '@nestjs/jwt';
import { UsersService, UserWithoutPassword } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<UserWithoutPassword | null>;
    login(user: UserWithoutPassword): Promise<{
        user: {
            id: number;
            username: string;
        };
        accessToken: string;
    }>;
}
