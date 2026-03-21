import { Controller, Post, Body, Get, UseGuards, Request, Patch, Put, Delete, Query, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly adminService: AdminService,
        private readonly jwtService: JwtService
    ) { }

    @Post('login')
    async login(@Body() body: any) {
        const { email, password } = body;
        const user: any = await this.adminService.findByEmail(email);

        if (user && await bcrypt.compare(password, user.password)) {
            if (!user.isApproved && user.role !== 'admin') {
                return { message: 'Aguardando aprovação do administrador.' };
            }
            const payload = { sub: user.id, email: user.email, role: user.role };
            const token = await this.jwtService.signAsync(payload);
            return {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role
                }
            };
        }
        return { message: 'Credenciais inválidas' };
    }

    @Post('register')
    async register(@Body() userData: any) {
        const user: any = await this.adminService.create({
            ...userData,
            isApproved: false, // Força não aprovado inicialmente
            role: 'user'       // Força role básico
        });
        return {
            message: 'Cadastro realizado com sucesso! Aguarde a aprovação de um administrador para acessar o sistema.',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('pending')
    async getPendingUsers() {
        const all = await this.adminService.findAll();
        return all.filter((u: any) => !u.isApproved);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('approve/:id')
    async approveUser(@Param('id') id: string) {
        return this.adminService.update(id, { isApproved: true, role: 'admin' });
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        // Mocking for now - ideally get current user from JWT
        const users: any = await this.adminService.findAll();
        if (users && users.length > 0) {
            const user: any = users[0];
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            };
        }
        return { message: 'User not found' };
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(@Body() userData: any) {
        let user: any;
        if (userData.id) {
            user = await this.adminService.findById(userData.id);
        } else {
            user = await this.adminService.findByEmail(userData.email);
        }

        if (user) {
            const updated: any = await this.adminService.update(user.id, userData);
            return {
                id: updated.id,
                name: updated.name,
                email: updated.email,
                avatar: updated.avatar,
            };
        }
        return { message: 'User not found' };
    }

    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    async patchProfile(@Body() userData: any) {
        return this.updateProfile(userData);
    }

    @UseGuards(JwtAuthGuard)
    @Put('password')
    async updatePassword(@Body() body: any) {
        const { email, currentPassword, newPassword } = body;
        const user: any = await this.adminService.findByEmail(email);

        if (!user) {
            return { message: 'Usuário não encontrado' };
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return { message: 'Senha atual incorreta' };
        }

        await this.adminService.update(user.id, { password: newPassword });
        return { message: 'Senha alterada com sucesso!' };
    }

    @UseGuards(JwtAuthGuard)
    @Delete('account')
    async deleteAccount(@Query('email') email: string) {
        const user: any = await this.adminService.findByEmail(email);
        if (user) {
            await this.adminService.remove(user.id);
            return { message: 'Conta excluída com sucesso!' };
        }
        return { message: 'Usuário não encontrado' };
    }
}
