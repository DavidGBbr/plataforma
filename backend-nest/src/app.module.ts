import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AlunosModule } from "./alunos/alunos.module";
import { TurmasModule } from "./turmas/turmas.module";
import { DevelopersModule } from "./developers/developers.module";
import { AdminModule } from "./admin/admin.module";
import { HealthController } from "./health/health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>("DATABASE_URL");
        return {
          type: "postgres",
          url: url,
          autoLoadEntities: true,
          migrations: [
            __dirname.replace(/\\/g, "/") + "/migrations/*{.ts,.js}",
          ],
          synchronize: false, // Migrations s&#227;o usadas no lugar de synchronize
          ssl:
            url?.includes("supabase") ||
            url?.includes("neon") ||
            url?.includes("require")
              ? { rejectUnauthorized: false }
              : false,
        };
      },
    }),
    AlunosModule,
    TurmasModule,
    DevelopersModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
