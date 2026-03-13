import { ComputersRepository } from './computers.repository';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
export declare class ComputersService {
    private readonly computersRepository;
    constructor(computersRepository: ComputersRepository);
    create(ownerId: number, dto: CreateComputerDto): Promise<{
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
    findById(id: string): Promise<{
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
    findByOwner(ownerId: number): Promise<({
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
    findMyComputer(ownerId: number, computerId: string): Promise<{
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
    explore(id: string, visitorIdentifier: string): Promise<{
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
    update(ownerId: number, id: string, dto: UpdateComputerDto): Promise<{
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
    publish(ownerId: number, id: string): Promise<{
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
    unpublish(ownerId: number, id: string): Promise<{
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
    delete(ownerId: number, id: string): Promise<{
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
    getStats(ownerId: number, id: string): Promise<{
        id: string;
        name: string;
        isPublished: boolean;
        visitCount: number;
        fileCount: number;
        folderCount: number;
        createdAt: Date;
        publishedAt: Date | null;
    }>;
    private hashVisitor;
}
