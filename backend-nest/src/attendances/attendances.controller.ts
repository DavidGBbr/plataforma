import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../admin/jwt-auth.guard';
import { AttendancesService } from './attendances.service';

@UseGuards(JwtAuthGuard)
@Controller('attendances')
export class AttendancesController {
    constructor(private readonly service: AttendancesService) { }

    @Post()
    create(@Body() dto: any) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }
}
