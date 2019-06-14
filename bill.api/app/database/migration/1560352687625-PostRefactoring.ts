import {MigrationInterface, PrimaryGeneratedColumn, QueryRunner, TableColumn} from "typeorm";

export class PostRefactoring1560352687625 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn("bc_user", "id", new TableColumn({name:"id",type:"varchar",length:"36",isPrimary:true}));
        await queryRunner.changeColumn("bc_user", "id", PrimaryGeneratedColumn("uuid")());
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn("bc_user", "id", new TableColumn({name:"id",type:"varchar",length:"255",isPrimary:true}));
    }

}
