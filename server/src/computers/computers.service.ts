import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ComputersRepository } from './computers.repository';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
import * as crypto from 'crypto';

@Injectable()
export class ComputersService {
  constructor(private readonly computersRepository: ComputersRepository) {}

  async create(ownerId: number, dto: CreateComputerDto) {
    return this.computersRepository.create({
      name: dto.name || 'My Computer',
      description: dto.description,
      owner: {
        connect: { id: ownerId },
      },
    });
  }

  async findById(id: string) {
    const computer = await this.computersRepository.findById(id);
    if (!computer) {
      throw new NotFoundException('Computer not found');
    }
    return computer;
  }

  async findByOwner(ownerId: number) {
    return this.computersRepository.findByOwner(ownerId);
  }

  async findMyComputer(ownerId: number, computerId: string) {
    const computer = await this.computersRepository.findById(computerId);
    if (!computer) {
      throw new NotFoundException('Computer not found');
    }
    if (computer.ownerId !== ownerId) {
      throw new ForbiddenException('Not your computer');
    }
    return computer;
  }

  // For visitors - only shows published computers with non-hidden content
  async explore(id: string, visitorIdentifier: string) {
    const computer = await this.computersRepository.findPublishedById(id);
    if (!computer) {
      throw new NotFoundException('Computer not found');
    }

    // Generate a hash for the visitor (anonymous tracking)
    const visitorHash = this.hashVisitor(visitorIdentifier);

    // Check if this is a new visit
    const hasVisited = await this.computersRepository.hasVisited(id, visitorHash);
    
    if (!hasVisited) {
      // Record new visit and increment counter
      await this.computersRepository.recordVisit(id, visitorHash);
      await this.computersRepository.incrementVisitCount(id);
    }

    // Return computer without sensitive owner info
    const { ownerId, ...publicComputer } = computer;
    return publicComputer;
  }

  // Get a random published computer to explore
  async discoverRandom() {
    const computer = await this.computersRepository.findRandom();
    if (!computer) {
      return null;
    }

    // Return without sensitive owner info
    const { ownerId, ...publicComputer } = computer;
    return publicComputer;
  }

  async update(ownerId: number, id: string, dto: UpdateComputerDto) {
    const computer = await this.findMyComputer(ownerId, id);
    
    return this.computersRepository.update(id, {
      name: dto.name,
      description: dto.description,
    });
  }

  async publish(ownerId: number, id: string) {
    await this.findMyComputer(ownerId, id);
    return this.computersRepository.publish(id);
  }

  async unpublish(ownerId: number, id: string) {
    await this.findMyComputer(ownerId, id);
    return this.computersRepository.unpublish(id);
  }

  async delete(ownerId: number, id: string) {
    await this.findMyComputer(ownerId, id);
    return this.computersRepository.delete(id);
  }

  // Get owner dashboard stats
  async getStats(ownerId: number, id: string) {
    const computer = await this.findMyComputer(ownerId, id);
    return {
      id: computer.id,
      name: computer.name,
      isPublished: computer.isPublished,
      visitCount: computer.visitCount,
      fileCount: computer.files.length,
      folderCount: computer.folders.length,
      createdAt: computer.createdAt,
      publishedAt: computer.publishedAt,
    };
  }

  private hashVisitor(identifier: string): string {
    return crypto.createHash('sha256').update(identifier).digest('hex').slice(0, 32);
  }
}
