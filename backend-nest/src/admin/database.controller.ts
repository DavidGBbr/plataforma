import { Controller, Post, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('database')
export class DatabaseController {
  constructor(private readonly dataSource: DataSource) {}

  @UseGuards(JwtAuthGuard)
  @Post('migrations/run')
  async runMigrations() {
    try {
      const migrations = await this.dataSource.runMigrations();
      return {
        success: true,
        message: 'Migrations executed successfully',
        migrations: migrations.map(m => m.name),
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: 'Failed to run migrations',
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
