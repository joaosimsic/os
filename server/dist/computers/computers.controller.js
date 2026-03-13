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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputersController = void 0;
const common_1 = require("@nestjs/common");
const computers_service_1 = require("./computers.service");
const create_computer_dto_1 = require("./dto/create-computer.dto");
const update_computer_dto_1 = require("./dto/update-computer.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ComputersController = class ComputersController {
    computersService;
    constructor(computersService) {
        this.computersService = computersService;
    }
    async discoverRandom() {
        return this.computersService.discoverRandom();
    }
    async explore(id, ip, userAgent) {
        const visitorIdentifier = `${ip}:${userAgent || 'unknown'}`;
        return this.computersService.explore(id, visitorIdentifier);
    }
    async create(req, dto) {
        return this.computersService.create(req.user.id, dto);
    }
    async findMine(req) {
        return this.computersService.findByOwner(req.user.id);
    }
    async findMyComputer(req, id) {
        return this.computersService.findMyComputer(req.user.id, id);
    }
    async getStats(req, id) {
        return this.computersService.getStats(req.user.id, id);
    }
    async update(req, id, dto) {
        return this.computersService.update(req.user.id, id, dto);
    }
    async publish(req, id) {
        return this.computersService.publish(req.user.id, id);
    }
    async unpublish(req, id) {
        return this.computersService.unpublish(req.user.id, id);
    }
    async delete(req, id) {
        await this.computersService.delete(req.user.id, id);
        return { message: 'Computer deleted' };
    }
};
exports.ComputersController = ComputersController;
__decorate([
    (0, common_1.Get)('discover'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComputersController.prototype, "discoverRandom", null);
__decorate([
    (0, common_1.Get)('explore/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Ip)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ComputersController.prototype, "explore", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_computer_dto_1.CreateComputerDto]),
    __metadata("design:returntype", Promise)
], ComputersController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('mine'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComputersController.prototype, "findMine", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('mine/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ComputersController.prototype, "findMyComputer", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('mine/:id/stats'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ComputersController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('mine/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_computer_dto_1.UpdateComputerDto]),
    __metadata("design:returntype", Promise)
], ComputersController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('mine/:id/publish'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ComputersController.prototype, "publish", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('mine/:id/unpublish'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ComputersController.prototype, "unpublish", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('mine/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ComputersController.prototype, "delete", null);
exports.ComputersController = ComputersController = __decorate([
    (0, common_1.Controller)('computers'),
    __metadata("design:paramtypes", [computers_service_1.ComputersService])
], ComputersController);
//# sourceMappingURL=computers.controller.js.map