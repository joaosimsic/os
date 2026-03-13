import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Ip,
  Headers,
} from '@nestjs/common';
import { ComputersService } from './computers.service';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('computers')
export class ComputersController {
  constructor(private readonly computersService: ComputersService) {}

  // ==================== Public Routes ====================

  // Discover a random computer (anonymous)
  @Get('discover')
  async discoverRandom() {
    return this.computersService.discoverRandom();
  }

  // Explore a specific published computer (anonymous)
  @Get('explore/:id')
  async explore(
    @Param('id') id: string,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    // Create anonymous visitor identifier from IP + user agent
    const visitorIdentifier = `${ip}:${userAgent || 'unknown'}`;
    return this.computersService.explore(id, visitorIdentifier);
  }

  // ==================== Protected Routes (Owner) ====================

  // Create a new computer
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() dto: CreateComputerDto) {
    return this.computersService.create(req.user.id, dto);
  }

  // Get all my computers
  @UseGuards(JwtAuthGuard)
  @Get('mine')
  async findMine(@Request() req) {
    return this.computersService.findByOwner(req.user.id);
  }

  // Get one of my computers (with all content including hidden)
  @UseGuards(JwtAuthGuard)
  @Get('mine/:id')
  async findMyComputer(@Request() req, @Param('id') id: string) {
    return this.computersService.findMyComputer(req.user.id, id);
  }

  // Get stats for my computer
  @UseGuards(JwtAuthGuard)
  @Get('mine/:id/stats')
  async getStats(@Request() req, @Param('id') id: string) {
    return this.computersService.getStats(req.user.id, id);
  }

  // Update my computer
  @UseGuards(JwtAuthGuard)
  @Put('mine/:id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateComputerDto,
  ) {
    return this.computersService.update(req.user.id, id, dto);
  }

  // Publish my computer
  @UseGuards(JwtAuthGuard)
  @Post('mine/:id/publish')
  async publish(@Request() req, @Param('id') id: string) {
    return this.computersService.publish(req.user.id, id);
  }

  // Unpublish my computer
  @UseGuards(JwtAuthGuard)
  @Post('mine/:id/unpublish')
  async unpublish(@Request() req, @Param('id') id: string) {
    return this.computersService.unpublish(req.user.id, id);
  }

  // Delete my computer
  @UseGuards(JwtAuthGuard)
  @Delete('mine/:id')
  async delete(@Request() req, @Param('id') id: string) {
    await this.computersService.delete(req.user.id, id);
    return { message: 'Computer deleted' };
  }
}
