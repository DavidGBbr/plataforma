import { MigrationInterface, QueryRunner } from "typeorm";

export class MigracaoInicial1774127222646 implements MigrationInterface {
    name = 'MigracaoInicial1774127222646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Turma" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "turma" character varying, "professor" character varying, "data" character varying NOT NULL DEFAULT now(), "presentes" integer NOT NULL DEFAULT '0', "ausentes" integer NOT NULL DEFAULT '0', "total" integer NOT NULL DEFAULT '0', "visitantes" character varying, "present_students" jsonb, "absent_students" jsonb, "recorded_by" character varying, CONSTRAINT "PK_0e509131675d1aa5d2f9abc2aba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Developer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "email" character varying, "date_of_birth" character varying, CONSTRAINT "PK_f22413012a21385967d154f4d42" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "system_status" ("id" character varying NOT NULL DEFAULT 'main', "is_call_active" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_0d676b0fa4195cb0c17bd055baa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Aluno" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "status" character varying NOT NULL DEFAULT 'active', "type" character varying NOT NULL DEFAULT 'official', "turma" character varying, "registered_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d45f108ae1e3fbe3141c2300659" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attendances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "student_name" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'official', "status" character varying NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "recorded_by" character varying, CONSTRAINT "PK_483ed97cd4cd43ab4a117516b69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "User" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "email" character varying, "password" character varying, "avatar" text, "role" character varying NOT NULL DEFAULT 'user', "is_approved" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "attendances"`);
        await queryRunner.query(`DROP TABLE "Aluno"`);
        await queryRunner.query(`DROP TABLE "system_status"`);
        await queryRunner.query(`DROP TABLE "Developer"`);
        await queryRunner.query(`DROP TABLE "Turma"`);
    }

}
