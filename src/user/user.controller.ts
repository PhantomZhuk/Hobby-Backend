import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  private generateTokens(email: string) {
    const accessToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' });
    return { accessToken, refreshToken };
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'User already exists' })
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      await this.userService.create(createUserDto);
      const { accessToken, refreshToken } = this.generateTokens(createUserDto.email);
      await this.setAuthCookies(res, accessToken, refreshToken);
      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
    try {
      await this.userService.login(body.email, body.password);
      const { accessToken, refreshToken } = this.generateTokens(body.email);
      this.setAuthCookies(res, accessToken, refreshToken);
      return res.status(200).json({ message: 'User logged in successfully' });
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Access token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken = req.cookies['refreshToken'];
      if (!refreshToken) throw new HttpException('Refresh token missing', HttpStatus.UNAUTHORIZED);

      const isValid = await this.userService.verifyRefreshToken(refreshToken);
      if (!isValid) throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
      const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(decoded.email);
      this.setAuthCookies(res, accessToken, newRefreshToken);
      return res.status(200).json({ message: 'Token refreshed successfully' });
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiOperation({ summary: 'Verify token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Invalid or missing token' })
  @Get('verifyToken')
  async verifyToken(@Req() req: Request, @Res() res: Response) {
    try {
      const accessToken = req.cookies['accessToken'];
      if (!accessToken) throw new HttpException('Access token missing', HttpStatus.UNAUTHORIZED);

      jwt.verify(accessToken, process.env.JWT_SECRET_KEY!);
      return res.status(200).json({ message: 'Token is valid' });
    } catch (error) {
      throw new HttpException('Invalid or expired access token', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({ status: 200, description: 'User info retrieved successfully' })
  @Get('userInfo')
  async userInfo(@Req() req: Request, @Res() res: Response) {
    try {
      const accessToken = req.cookies['accessToken'];
      if (!accessToken) throw new HttpException('Access token missing', HttpStatus.UNAUTHORIZED);

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY!) as any;
      const user = await this.userService.findByEmail(decoded.email);
      if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      return res.status(200).json(user);
    } catch (error) {
      throw new HttpException('Invalid or expired access token', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiOperation({ summary: 'Update user info' })
  @ApiResponse({ status: 200, description: 'User info updated successfully' })
  @ApiResponse({ status: 401, description: 'Access token missing' })
  @Post('updateUser')
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req: Request, @Res() res: Response) {
    try {
      const accessToken = req.cookies['accessToken'];
      if (!accessToken) throw new HttpException('Access token missing', HttpStatus.UNAUTHORIZED);

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY!) as any;
      const updatedUser = await this.userService.updateUser(decoded.email, updateUserDto);
      return res.status(200).json(updatedUser);
    } catch (error) {
      throw new HttpException('Invalid or expired access token', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'All users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Access token missing' })
  @Get("allUsers")
  async getAllUsers(@Res() res: Response, @Req() req: Request) {
    try {
      const accessToken = req.cookies['accessToken'];
      if (!accessToken) throw new HttpException('Access token missing', HttpStatus.UNAUTHORIZED);

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY!) as any;
      const user = await this.userService.findByEmail(decoded.email);
      if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      if (user.isAdmin === false) throw new HttpException('Access denied', HttpStatus.FORBIDDEN);

      const users = await this.userService.findAll();
      return res.status(200).json(users);
    } catch (error) {
      throw new HttpException('Invalid or expired access token', HttpStatus.UNAUTHORIZED);
    }
  }
}