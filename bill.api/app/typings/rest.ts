export interface RestFullController {
    index();

    show();

    create?();

    destroy?();

    update?();
}

export interface RestFullService {
    create?(data: any): Promise<any>;

    destroy?(id: string): Promise<any>;

    update?(id: string, data: any): Promise<any>;

    show(id: string): Promise<any>;

    index(params: any): Promise<any[]>;
}