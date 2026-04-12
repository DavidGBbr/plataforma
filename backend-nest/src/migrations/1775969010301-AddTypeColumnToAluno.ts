import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeColumnToAluno1775969010301 implements MigrationInterface {
    name = 'AddTypeColumnToAluno1775969010301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const column = await queryRunner.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'Aluno' AND column_name = 'type'`);
        if (column.length === 0) {
            await queryRunner.query(`ALTER TABLE "Aluno" ADD "type" character varying NOT NULL DEFAULT 'official'`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Aluno" DROP COLUMN "type"`);
    }

}
