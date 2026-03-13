import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ComputersModule } from './computers/computers.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ComputersModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
