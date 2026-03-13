import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService, UserWithoutPassword } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserWithoutPassword | null> {
    return this.usersService.validateUser(username, password);
  }

  async login(user: UserWithoutPassword) {
    const payload = { username: user.username, sub: user.id };
    return {
      user: {
        id: user.id,
        username: user.username,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }
}
