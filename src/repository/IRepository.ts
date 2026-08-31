export type id = string;

export interface Initializable{
    init():Promise<void>;
}

export interface IRepository<T extends ID>{
    create (item:T):Promise<id>
    get(id:id):Promise<T>;
    getAll():Promise<T[]>;
    update(item:T):Promise<void>
    delete(id:id):Promise<void>
}

export interface ID{
    getId():id;
}

export interface InitializableRepository<T extends ID> extends IRepository<T>,Initializable{}