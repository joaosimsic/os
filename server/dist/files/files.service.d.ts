import { FilesRepository } from './files.repository';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { ComputersService } from '../computers/computers.service';
export declare class FilesService {
    private readonly filesRepository;
    private readonly computersService;
    constructor(filesRepository: FilesRepository, computersService: ComputersService);
    create(ownerId: number, computerId: string, dto: CreateFileDto): Promise<{
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
    findById(id: string): Promise<{
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
    findByComputer(computerId: string): Promise<{
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
    update(ownerId: number, id: string, dto: UpdateFileDto): Promise<{
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
    delete(ownerId: number, id: string): Promise<{
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
}
