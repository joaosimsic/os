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
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('computers/:computerId/files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  async create(
    @Request() req,
    @Param('computerId') computerId: string,
    @Body() dto: CreateFileDto,
  ) {
    return this.filesService.create(req.user.id, computerId, dto);
  }

  @Get()
  async findAll(@Param('computerId') computerId: string) {
    return this.filesService.findByComputer(computerId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.filesService.findById(id);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateFileDto,
  ) {
    return this.filesService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    await this.filesService.delete(req.user.id, id);
    return { message: 'File deleted' };
  }
}
