import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
export type UserWithoutPassword = Omit<User, 'password'>;
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    create(createUserDto: CreateUserDto): Promise<UserWithoutPassword>;
    findById(id: number): Promise<UserWithoutPassword | null>;
    findByUsername(username: string): Promise<User | null>;
    findAll(): Promise<UserWithoutPassword[]>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<UserWithoutPassword>;
    delete(id: number): Promise<void>;
    validateUser(username: string, pass: string): Promise<UserWithoutPassword | null>;
}
