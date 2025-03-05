import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res
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
    await this.userService.create(createUserDto);
    const { accessToken, refreshToken } = this.generateTokens(createUserDto.email);
    this.setAuthCookies(res, accessToken, refreshToken);
    return res.status(201).json({ message: 'User created successfully' });
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
    await this.userService.login(body.email, body.password);
    const { accessToken, refreshToken } = this.generateTokens(body.email);
    this.setAuthCookies(res, accessToken, refreshToken);
    return res.status(200).json({ message: 'User logged in successfully' });
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
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new Error('Refresh token missing');

    const isValid = await this.userService.verifyRefreshToken(refreshToken);
    if (!isValid) throw new Error('Invalid refresh token');

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(decoded.email);
    this.setAuthCookies(res, accessToken, newRefreshToken);
    return res.status(200).json({ message: 'Token refreshed successfully' });
  }

  @ApiOperation({ summary: 'Verify token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Invalid or missing token' })
  @Get('verifyToken')
  async verifyToken(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.cookies['accessToken'];
    if (!accessToken) throw new Error('Access token missing');

    try {
      jwt.verify(accessToken, process.env.JWT_SECRET_KEY!);
      return res.status(200).json({ message: 'Token is valid' });
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({ status: 200, description: 'User info retrieved successfully' })
  @Get('userInfo')
  async userInfo(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.cookies['accessToken'];
    if (!accessToken) throw new Error('Access token missing');

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY!) as any;
    const user = await this.userService.findByEmail(decoded.email);
    if (!user) throw new Error('User not found');

    return res.status(200).json(user);
  }

  @ApiOperation({ summary: 'Update user info' })
  @ApiResponse({ status: 200, description: 'User info updated successfully' })
  @ApiResponse({ status: 401, description: 'Access token missing' })
  @Post('updateUser')
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req: Request, @Res() res: Response) {
    const accessToken = req.cookies['accessToken'];
    if (!accessToken) throw new Error('Access token missing');

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY!) as any;
    const updatedUser = await this.userService.updateUser(decoded.email, updateUserDto);
    return res.status(200).json(updatedUser);
  }
}