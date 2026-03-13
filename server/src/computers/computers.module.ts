import { Module } from '@nestjs/common';
import { ComputersController } from './computers.controller';
import { ComputersService } from './computers.service';
import { ComputersRepository } from './computers.repository';

@Module({
  controllers: [ComputersController],
  providers: [ComputersService, ComputersRepository],
  exports: [ComputersService],
})
export class ComputersModule {}
