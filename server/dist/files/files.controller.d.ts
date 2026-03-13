import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    create(req: any, computerId: string, dto: CreateFileDto): Promise<{
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
    }>;
    findAll(computerId: string): Promise<{
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
    }[]>;
    findOne(id: string): Promise<{
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
    }>;
    update(req: any, id: string, dto: UpdateFileDto): Promise<{
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
    }>;
    delete(req: any, id: string): Promise<{
        message: string;
    }>;
}
