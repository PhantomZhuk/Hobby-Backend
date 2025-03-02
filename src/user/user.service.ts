import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/Schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
    constructor(@InjectModel("User") private readonly userModel: Model<User>) { }

    async create(createUserDto: CreateUserDto, refreshToken: string): Promise<User> {
        const users = await this.userModel.find().exec();

        if (users.find(user => user.email === createUserDto.email)) {
            throw new UnauthorizedException("User already exists");
        }

        createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.userModel.create({
            ...createUserDto,
            refreshToken
        });
        return user;
    }

    async login(email: string, password: string, refreshToken: string) {
        const user = await this.userModel.findOne({ email }).exec();

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid password");
        }

        user.refreshToken = refreshToken;

        await user.save();

        return user;
    }

    async logout(email: string) {
        const user = await this.userModel.findOne({ email }).exec();

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        user.refreshToken = "";

        await user.save();

        return { message: "success" };
    }

    async verifyRefreshToken(refreshToken: string): Promise<boolean> {
        try {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
            return true;
        } catch (error) {
            return false;
        }
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email }).exec();
    }
}
