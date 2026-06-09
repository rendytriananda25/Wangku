import { MenuEntity } from '../entities/MenuEntity';


export interface IMenuRepository {
    getAll(): Promise<MenuEntity[]>;
    add(name: string, category: string, price: number, imageUrl?: string): Promise<MenuEntity>;
    delete(id: string): Promise<void>;
    pullFromCloud(): Promise<void>;
    pushToCloud(): Promise<void>;
}
