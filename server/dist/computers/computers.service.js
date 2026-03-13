"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputersService = void 0;
const common_1 = require("@nestjs/common");
const computers_repository_1 = require("./computers.repository");
const crypto = __importStar(require("crypto"));
let ComputersService = class ComputersService {
    computersRepository;
    constructor(computersRepository) {
        this.computersRepository = computersRepository;
    }
    async create(ownerId, dto) {
        return this.computersRepository.create({
            name: dto.name || 'My Computer',
            description: dto.description,
            owner: {
                connect: { id: ownerId },
            },
        });
    }
    async findById(id) {
        const computer = await this.computersRepository.findById(id);
        if (!computer) {
            throw new common_1.NotFoundException('Computer not found');
        }
        return computer;
    }
    async findByOwner(ownerId) {
        return this.computersRepository.findByOwner(ownerId);
    }
    async findMyComputer(ownerId, computerId) {
        const computer = await this.computersRepository.findById(computerId);
        if (!computer) {
            throw new common_1.NotFoundException('Computer not found');
        }
        if (computer.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('Not your computer');
        }
        return computer;
    }
    async explore(id, visitorIdentifier) {
        const computer = await this.computersRepository.findPublishedById(id);
        if (!computer) {
            throw new common_1.NotFoundException('Computer not found');
        }
        const visitorHash = this.hashVisitor(visitorIdentifier);
        const hasVisited = await this.computersRepository.hasVisited(id, visitorHash);
        if (!hasVisited) {
            await this.computersRepository.recordVisit(id, visitorHash);
            await this.computersRepository.incrementVisitCount(id);
        }
        const { ownerId, ...publicComputer } = computer;
        return publicComputer;
    }
    async discoverRandom() {
        const computer = await this.computersRepository.findRandom();
        if (!computer) {
            return null;
        }
        const { ownerId, ...publicComputer } = computer;
        return publicComputer;
    }
    async update(ownerId, id, dto) {
        const computer = await this.findMyComputer(ownerId, id);
        return this.computersRepository.update(id, {
            name: dto.name,
            description: dto.description,
        });
    }
    async publish(ownerId, id) {
        await this.findMyComputer(ownerId, id);
        return this.computersRepository.publish(id);
    }
    async unpublish(ownerId, id) {
        await this.findMyComputer(ownerId, id);
        return this.computersRepository.unpublish(id);
    }
    async delete(ownerId, id) {
        await this.findMyComputer(ownerId, id);
        return this.computersRepository.delete(id);
    }
    async getStats(ownerId, id) {
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
    hashVisitor(identifier) {
        return crypto.createHash('sha256').update(identifier).digest('hex').slice(0, 32);
    }
};
exports.ComputersService = ComputersService;
exports.ComputersService = ComputersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [computers_repository_1.ComputersRepository])
], ComputersService);
//# sourceMappingURL=computers.service.js.map