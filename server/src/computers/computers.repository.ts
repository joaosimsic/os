import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ComputersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ComputerCreateInput) {
    return this.prisma.computer.create({
      data,
      include: {
        files: true,
        folders: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.computer.findUnique({
      where: { id },
      include: {
        files: true,
        folders: {
          include: {
            files: true,
          },
        },
      },
    });
  }

  async findByOwner(ownerId: number) {
    return this.prisma.computer.findMany({
      where: { ownerId },
      include: {
        files: true,
        folders: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublishedById(id: string) {
    return this.prisma.computer.findFirst({
      where: { id, isPublished: true },
      include: {
        files: {
          where: { isHidden: false },
        },
        folders: {
          where: { isHidden: false },
          include: {
            files: {
              where: { isHidden: false },
            },
          },
        },
      },
    });
  }

  async findRandom() {
    // Get count of published computers
    const count = await this.prisma.computer.count({
      where: { isPublished: true },
    });

    if (count === 0) return null;

    // Get a random offset
    const randomOffset = Math.floor(Math.random() * count);

    // Fetch one random computer
    const computers = await this.prisma.computer.findMany({
      where: { isPublished: true },
      skip: randomOffset,
      take: 1,
      include: {
        files: {
          where: { isHidden: false },
        },
        folders: {
          where: { isHidden: false },
          include: {
            files: {
              where: { isHidden: false },
            },
          },
        },
      },
    });

    return computers[0] || null;
  }

  async update(id: string, data: Prisma.ComputerUpdateInput) {
    return this.prisma.computer.update({
      where: { id },
      data,
      include: {
        files: true,
        folders: true,
      },
    });
  }

  async publish(id: string) {
    return this.prisma.computer.update({
      where: { id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  async unpublish(id: string) {
    return this.prisma.computer.update({
      where: { id },
      data: {
        isPublished: false,
        publishedAt: null,
      },
    });
  }

  async incrementVisitCount(id: string) {
    return this.prisma.computer.update({
      where: { id },
      data: {
        visitCount: { increment: 1 },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.computer.delete({
      where: { id },
    });
  }

  // Visit tracking
  async recordVisit(computerId: string, visitorHash: string) {
    // Upsert to avoid duplicate visits from same visitor
    return this.prisma.visit.upsert({
      where: {
        visitorHash_computerId: {
          visitorHash,
          computerId,
        },
      },
      create: {
        visitorHash,
        computerId,
      },
      update: {
        visitedAt: new Date(),
      },
    });
  }

  async hasVisited(computerId: string, visitorHash: string) {
    const visit = await this.prisma.visit.findUnique({
      where: {
        visitorHash_computerId: {
          visitorHash,
          computerId,
        },
      },
    });
    return !!visit;
  }
}
