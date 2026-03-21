import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../admin/jwt-auth.guard';
import { AlunosService } from './alunos.service';

@UseGuards(JwtAuthGuard)
@Controller('alunos')
export class AlunosController {
    constructor(private readonly alunosService: AlunosService) { }

    @Post()
    create(@Body() createDto: any) {
        return this.alunosService.create(createDto);
    }

    @Get()
    findAll() {
        return this.alunosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.alunosService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateDto: any) {
        return this.alunosService.update(id, updateDto);
    }

    @Patch(':id')
    partialUpdate(@Param('id') id: string, @Body() updateDto: any) {
        return this.alunosService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.alunosService.remove(id);
    }
}
