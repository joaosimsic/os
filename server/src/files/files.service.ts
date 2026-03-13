import { Injectable, NotFoundException } from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { ComputersService } from '../computers/computers.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly filesRepository: FilesRepository,
    private readonly computersService: ComputersService,
  ) {}

  async create(ownerId: number, computerId: string, dto: CreateFileDto) {
    // Verify ownership
    await this.computersService.findMyComputer(ownerId, computerId);

    return this.filesRepository.create({
      computerId,
      name: dto.name,
      type: dto.type,
      content: dto.content,
      folderId: dto.folderId,
      icon: dto.icon,
      isHidden: dto.isHidden ?? false,
      positionX: dto.positionX ?? 0,
      positionY: dto.positionY ?? 0,
    });
  }

  async findById(id: string) {
    const file = await this.filesRepository.findById(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async findByComputer(computerId: string) {
    return this.filesRepository.findByComputer(computerId);
  }

  async update(ownerId: number, id: string, dto: UpdateFileDto) {
    const file = await this.findById(id);
    
    // Verify ownership through computer
    await this.computersService.findMyComputer(ownerId, file.computerId);

    // Build update object, handling folderId specially for relation
    const updateData: Record<string, unknown> = {};
    
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.type !== undefined) updateData.type = dto.type;
    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.icon !== undefined) updateData.icon = dto.icon;
    if (dto.isHidden !== undefined) updateData.isHidden = dto.isHidden;
    if (dto.positionX !== undefined) updateData.positionX = dto.positionX;
    if (dto.positionY !== undefined) updateData.positionY = dto.positionY;
    
    // Handle folder relation
    if (dto.folderId !== undefined) {
      if (dto.folderId === null) {
        updateData.folder = { disconnect: true };
      } else {
        updateData.folder = { connect: { id: dto.folderId } };
      }
    }

    return this.filesRepository.update(id, updateData);
  }

  async delete(ownerId: number, id: string) {
    const file = await this.findById(id);
    
    // Verify ownership through computer
    await this.computersService.findMyComputer(ownerId, file.computerId);

    return this.filesRepository.delete(id);
  }
}
