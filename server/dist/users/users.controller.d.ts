import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./users.service").UserWithoutPassword>;
    findAll(): Promise<import("./users.service").UserWithoutPassword[]>;
    findOne(id: number): Promise<import("./users.service").UserWithoutPassword>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<import("./users.service").UserWithoutPassword>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
