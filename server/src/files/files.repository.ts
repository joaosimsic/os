import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.FileUncheckedCreateInput) {
    return this.prisma.file.create({ data });
  }

  async findById(id: string) {
    return this.prisma.file.findUnique({ where: { id } });
  }

  async findByComputer(computerId: string) {
    return this.prisma.file.findMany({
      where: { computerId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByFolder(folderId: string) {
    return this.prisma.file.findMany({
      where: { folderId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: string, data: Prisma.FileUpdateInput) {
    return this.prisma.file.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.file.delete({ where: { id } });
  }

  async deleteByComputer(computerId: string) {
    return this.prisma.file.deleteMany({ where: { computerId } });
  }
}
