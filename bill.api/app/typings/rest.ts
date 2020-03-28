export interface RestFullController {
    index();

    show();

    create();

    destroy();

    update();
}

export interface RestFullService {
    show(id:string):Promise<any>;

    create(data: any):Promise<any>;

    destroy(id:string):Promise<any>;

    update(id:string, data):Promise<any>;

    index(params:any):Promise<any[]>;
}