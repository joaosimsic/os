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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const files_repository_1 = require("./files.repository");
const computers_service_1 = require("../computers/computers.service");
let FilesService = class FilesService {
    filesRepository;
    computersService;
    constructor(filesRepository, computersService) {
        this.filesRepository = filesRepository;
        this.computersService = computersService;
    }
    async create(ownerId, computerId, dto) {
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
    async findById(id) {
        const file = await this.filesRepository.findById(id);
        if (!file) {
            throw new common_1.NotFoundException('File not found');
        }
        return file;
    }
    async findByComputer(computerId) {
        return this.filesRepository.findByComputer(computerId);
    }
    async update(ownerId, id, dto) {
        const file = await this.findById(id);
        await this.computersService.findMyComputer(ownerId, file.computerId);
        const updateData = {};
        if (dto.name !== undefined)
            updateData.name = dto.name;
        if (dto.type !== undefined)
            updateData.type = dto.type;
        if (dto.content !== undefined)
            updateData.content = dto.content;
        if (dto.icon !== undefined)
            updateData.icon = dto.icon;
        if (dto.isHidden !== undefined)
            updateData.isHidden = dto.isHidden;
        if (dto.positionX !== undefined)
            updateData.positionX = dto.positionX;
        if (dto.positionY !== undefined)
            updateData.positionY = dto.positionY;
        if (dto.folderId !== undefined) {
            if (dto.folderId === null) {
                updateData.folder = { disconnect: true };
            }
            else {
                updateData.folder = { connect: { id: dto.folderId } };
            }
        }
        return this.filesRepository.update(id, updateData);
    }
    async delete(ownerId, id) {
        const file = await this.findById(id);
        await this.computersService.findMyComputer(ownerId, file.computerId);
        return this.filesRepository.delete(id);
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [files_repository_1.FilesRepository,
        computers_service_1.ComputersService])
], FilesService);
//# sourceMappingURL=files.service.js.map