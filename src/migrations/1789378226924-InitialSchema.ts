import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1789378226924 implements MigrationInterface {
    name = 'InitialSchema1789378226924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'teacher', 'student', 'parent')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'student', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."announcements_audience_enum" AS ENUM('all', 'students', 'teachers', 'parents')`);
        await queryRunner.query(`CREATE TABLE "announcements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" text NOT NULL, "audience" "public"."announcements_audience_enum" NOT NULL DEFAULT 'all', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postedById" uuid, CONSTRAINT "PK_b3ad760876ff2e19d58e05dc8b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teachers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "staffNumber" character varying NOT NULL, "department" character varying, "qualification" character varying, "dateJoined" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "UQ_f2938815718161b81b923bfd710" UNIQUE ("staffNumber"), CONSTRAINT "REL_4d8041cbc103a5142fa2f2afad" UNIQUE ("userId"), CONSTRAINT "PK_a8d4f83be3abe4c687b0a0093c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subjects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "teacherId" uuid, CONSTRAINT "UQ_47a287fe64bd0e1027e603c335c" UNIQUE ("name"), CONSTRAINT "PK_1a023685ac2b051b4e557b0b280" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "classes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1f3940af28a76098f31004f03ca" UNIQUE ("name"), CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "admissionNumber" character varying NOT NULL, "dateOfBirth" TIMESTAMP, "gradeLevel" character varying, "guardianName" character varying, "guardianPhone" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "classId" uuid, CONSTRAINT "UQ_4c256c094ed2d72b3794e4fea86" UNIQUE ("admissionNumber"), CONSTRAINT "REL_e0208b4f964e609959aff431bf" UNIQUE ("userId"), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."attendance_status_enum" AS ENUM('present', 'absent', 'late', 'excused')`);
        await queryRunner.query(`CREATE TABLE "attendance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "status" "public"."attendance_status_enum" NOT NULL DEFAULT 'present', "remarks" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "studentId" uuid, "classId" uuid, "recordedById" uuid, CONSTRAINT "PK_ee0ffe42c1f1a01e72b725c0cb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."grades_term_enum" AS ENUM('first', 'second', 'third')`);
        await queryRunner.query(`CREATE TABLE "grades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "term" "public"."grades_term_enum" NOT NULL, "academicYear" character varying NOT NULL, "score" numeric(5,2) NOT NULL, "remarks" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "studentId" uuid, "subjectId" uuid, CONSTRAINT "PK_4740fb6f5df2505a48649f1687b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "classes_subjects_subjects" ("classesId" uuid NOT NULL, "subjectsId" uuid NOT NULL, CONSTRAINT "PK_58e3f73a660d5cff9181baa131b" PRIMARY KEY ("classesId", "subjectsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_06ffe2a689ce795d171437e8a0" ON "classes_subjects_subjects"  ("classesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6ff4d1484c3f2b25df6c91d285" ON "classes_subjects_subjects"  ("subjectsId") `);
        await queryRunner.query(`ALTER TABLE "announcements" ADD CONSTRAINT "FK_9239a03f192ebbe2decbb1eaa43" FOREIGN KEY ("postedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teachers" ADD CONSTRAINT "FK_4d8041cbc103a5142fa2f2afad4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD CONSTRAINT "FK_09338bca25c0e77ea89989dba1d" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_e0208b4f964e609959aff431bf9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_575e5ce508ee1275f45cb7c4c32" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendance" ADD CONSTRAINT "FK_120e1c6edcec4f8221f467c8039" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendance" ADD CONSTRAINT "FK_af129543ec010c822cb6f0254b5" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendance" ADD CONSTRAINT "FK_7c03b4a42be7f5e5ecca028f798" FOREIGN KEY ("recordedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_fcfc027e4e5fb37a4372e688070" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_53072aa77cf53aec5463b9b3505" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classes_subjects_subjects" ADD CONSTRAINT "FK_06ffe2a689ce795d171437e8a00" FOREIGN KEY ("classesId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "classes_subjects_subjects" ADD CONSTRAINT "FK_6ff4d1484c3f2b25df6c91d285d" FOREIGN KEY ("subjectsId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classes_subjects_subjects" DROP CONSTRAINT "FK_6ff4d1484c3f2b25df6c91d285d"`);
        await queryRunner.query(`ALTER TABLE "classes_subjects_subjects" DROP CONSTRAINT "FK_06ffe2a689ce795d171437e8a00"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_53072aa77cf53aec5463b9b3505"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_fcfc027e4e5fb37a4372e688070"`);
        await queryRunner.query(`ALTER TABLE "attendance" DROP CONSTRAINT "FK_7c03b4a42be7f5e5ecca028f798"`);
        await queryRunner.query(`ALTER TABLE "attendance" DROP CONSTRAINT "FK_af129543ec010c822cb6f0254b5"`);
        await queryRunner.query(`ALTER TABLE "attendance" DROP CONSTRAINT "FK_120e1c6edcec4f8221f467c8039"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_575e5ce508ee1275f45cb7c4c32"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_e0208b4f964e609959aff431bf9"`);
        await queryRunner.query(`ALTER TABLE "subjects" DROP CONSTRAINT "FK_09338bca25c0e77ea89989dba1d"`);
        await queryRunner.query(`ALTER TABLE "teachers" DROP CONSTRAINT "FK_4d8041cbc103a5142fa2f2afad4"`);
        await queryRunner.query(`ALTER TABLE "announcements" DROP CONSTRAINT "FK_9239a03f192ebbe2decbb1eaa43"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ff4d1484c3f2b25df6c91d285"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_06ffe2a689ce795d171437e8a0"`);
        await queryRunner.query(`DROP TABLE "classes_subjects_subjects"`);
        await queryRunner.query(`DROP TABLE "grades"`);
        await queryRunner.query(`DROP TYPE "public"."grades_term_enum"`);
        await queryRunner.query(`DROP TABLE "attendance"`);
        await queryRunner.query(`DROP TYPE "public"."attendance_status_enum"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`DROP TABLE "classes"`);
        await queryRunner.query(`DROP TABLE "subjects"`);
        await queryRunner.query(`DROP TABLE "teachers"`);
        await queryRunner.query(`DROP TABLE "announcements"`);
        await queryRunner.query(`DROP TYPE "public"."announcements_audience_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
