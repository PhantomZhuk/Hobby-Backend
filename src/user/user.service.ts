import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/Schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
    constructor(@InjectModel("User") private readonly userModel: Model<User>) { }

    async create(createUserDto: CreateUserDto) {
        console.log(createUserDto);
        const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();

        console.log(existingUser);
        if (existingUser) {
            console.log('User already exists');
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        } else {
            console.log('User does not exist');
            createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
            console.log(createUserDto);
            const user = await this.userModel.create(createUserDto);
            console.log(user);
            return user;
        }
    }

    async login(email: string, password: string) {
        const user = await this.userModel.findOne({ email }).exec();

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
        }

        await user.save();

        return user;
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

    async updateUser(email: string, updateUserDto: any) {
        const user = await this.userModel.findOne({ email }).exec();

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        await this.userModel.findOneAndUpdate({ email }, updateUserDto).exec();

        return user;
    }

    findAll() {
        return this.userModel.find().exec();
    }
}
