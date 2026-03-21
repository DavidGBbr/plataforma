import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../admin/jwt-auth.guard';
import { TurmasService } from './turmas.service';

@UseGuards(JwtAuthGuard)
@Controller('turmas')
export class TurmasController {
    constructor(private readonly service: TurmasService) { }

    @Post()
    create(@Body() dto: any) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: any) {
        return this.service.update(id, dto);
    }

    @Patch(':id')
    partialUpdate(@Param('id') id: string, @Body() dto: any) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
