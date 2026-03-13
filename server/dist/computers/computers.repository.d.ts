import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class ComputersRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ComputerCreateInput): Promise<{
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
    findById(id: string): Promise<({
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
    }) | null>;
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
    findPublishedById(id: string): Promise<({
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
    }) | null>;
    findRandom(): Promise<({
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
    }) | null>;
    update(id: string, data: Prisma.ComputerUpdateInput): Promise<{
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
    publish(id: string): Promise<{
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
    unpublish(id: string): Promise<{
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
    incrementVisitCount(id: string): Promise<{
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
    delete(id: string): Promise<{
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
    recordVisit(computerId: string, visitorHash: string): Promise<{
        computerId: string;
        visitorHash: string;
        visitedAt: Date;
    }>;
    hasVisited(computerId: string, visitorHash: string): Promise<boolean>;
}
