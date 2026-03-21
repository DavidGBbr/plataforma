import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Carrega as vari&#225;veis de ambiente do arquivo .env
dotenv.config({ path: resolve(__dirname, '.env') });

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname.replace(/\\/g, '/') + '/src/migrations/*{.ts,.js}'],
    subscribers: [],
});
