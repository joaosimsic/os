"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputersRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ComputersRepository = class ComputersRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.computer.create({
            data,
            include: {
                files: true,
                folders: true,
            },
        });
    }
    async findById(id) {
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
    async findByOwner(ownerId) {
        return this.prisma.computer.findMany({
            where: { ownerId },
            include: {
                files: true,
                folders: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findPublishedById(id) {
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
        const count = await this.prisma.computer.count({
            where: { isPublished: true },
        });
        if (count === 0)
            return null;
        const randomOffset = Math.floor(Math.random() * count);
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
    async update(id, data) {
        return this.prisma.computer.update({
            where: { id },
            data,
            include: {
                files: true,
                folders: true,
            },
        });
    }
    async publish(id) {
        return this.prisma.computer.update({
            where: { id },
            data: {
                isPublished: true,
                publishedAt: new Date(),
            },
        });
    }
    async unpublish(id) {
        return this.prisma.computer.update({
            where: { id },
            data: {
                isPublished: false,
                publishedAt: null,
            },
        });
    }
    async incrementVisitCount(id) {
        return this.prisma.computer.update({
            where: { id },
            data: {
                visitCount: { increment: 1 },
            },
        });
    }
    async delete(id) {
        return this.prisma.computer.delete({
            where: { id },
        });
    }
    async recordVisit(computerId, visitorHash) {
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
    async hasVisited(computerId, visitorHash) {
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
};
exports.ComputersRepository = ComputersRepository;
exports.ComputersRepository = ComputersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ComputersRepository);
//# sourceMappingURL=computers.repository.js.map