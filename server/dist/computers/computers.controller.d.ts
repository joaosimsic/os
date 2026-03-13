import { ComputersService } from './computers.service';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
export declare class ComputersController {
    private readonly computersService;
    constructor(computersService: ComputersService);
    discoverRandom(): Promise<{
        files: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isHidden: boolean;
            computerId: string;
            folderId: string | null;
            type: string;
            content: string;
            icon: string | null;
            positionX: number;
            positionY: number;
        }[];
        folders: ({
            files: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isHidden: boolean;
                computerId: string;
                folderId: string | null;
                type: string;
                content: string;
                icon: string | null;
                positionX: number;
                positionY: number;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isHidden: boolean;
            computerId: string;
            icon: string | null;
            positionX: number;
            positionY: number;
            parentId: string | null;
        })[];
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isPublished: boolean;
        visitCount: number;
        publishedAt: Date | null;
    } | null>;
    explore(id: string, ip: string, userAgent: string): Promise<{
        files: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isHidden: boolean;
            computerId: string;
            folderId: string | null;
            type: string;
            content: string;
            icon: string | null;
            positionX: number;
            positionY: number;
        }[];
        folders: ({
            files: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isHidden: boolean;
                computerId: string;
                folderId: string | null;
                type: string;
                content: string;
                icon: string | null;
                positionX: number;
                positionY: number;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isHidden: boolean;
            computerId: string;
            icon: string | null;
            positionX: number;
            positionY: number;
            parentId: string | null;
        })[];
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isPublished: boolean;
        visitCount: number;
        publishedAt: Date | null;
    }>;
    create(req: any, dto: CreateComputerDto): Promise<{
        files: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isHidden: boolean;
            computerId: string;
            folderId: string | null;
            type: string;
            content: string;
            icon: string | null;
            positionX: number;
            positionY: number;
        }[];
        folders: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isHidden: boolean;
            computerId: string;
            icon: string | null;
            positionX: number;
            positionY: number;
            parentId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isPublished: boolean;
        visitCount: number;
        publishedAt: Date | null;
        ownerId: number;
    }>;
    findMine(req: any): Promise<({
        files: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isHidden: boolean;
            computerId: string;
            folderId: string | null;
            type: string;
            content: string;
            icon: string | null;
            positionX: number;
            positionY: number;
        }[];
        folders: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isHidden: boolean;
            computerId: string;
            icon: string | null;
            positionX: number;
            positionY: number;
            parentId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isPublished: boolean;
        visitCount: number;
        publishedAt: Date | null;
        ownerId: number;
    })[]>;
    findMyComputer(req: any, id: string): Promise<{
        files: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isHidden: boolean;
            computerId: string;
            folderId: string | null;
            type: string;
            content: string;
            icon: string | null;
            positionX: number;
            positionY: number;
        }[];
        folders: ({
            files: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isHidden: boolean;
                computerId: string;
                folderId: string | null;
                type: string;
                content: string;
                icon: string | null;
                positionX: number;
                positionY: number;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isHidden: boolean;
            computerId: string;
            icon: string | null;
            positionX: number;
            positionY: number;
            parentId: string | null;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isPublished: boolean;
        visitCount: number;
        publishedAt: Date | null;
        ownerId: number;
    }>;
    getStats(req: any, id: string): Promise<{
        id: string;
        name: string;
        isPublished: boolean;
        visitCount: number;
        fileCount: number;
        folderCount: number;
        createdAt: Date;
        publishedAt: Date | null;
    }>;
    update(req: any, id: string, dto: UpdateComputerDto): Promise<{
        files: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isHidden: boolean;
            computerId: string;
            folderId: string | null;
            type: string;
            content: string;
            icon: string | null;
            positionX: number;
            positionY: number;
        }[];
        folders: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isHidden: boolean;
            computerId: string;
            icon: string | null;
            positionX: number;
            positionY: number;
            parentId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isPublished: boolean;
        visitCount: number;
        publishedAt: Date | null;
        ownerId: number;
    }>;
    publish(req: any, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isPublished: boolean;
        visitCount: number;
        publishedAt: Date | null;
        ownerId: number;
    }>;
    unpublish(req: any, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isPublished: boolean;
        visitCount: number;
        publishedAt: Date | null;
        ownerId: number;
    }>;
    delete(req: any, id: string): Promise<{
        message: string;
    }>;
}
