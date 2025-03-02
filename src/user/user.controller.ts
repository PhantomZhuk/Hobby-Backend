import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'User already exists' })
  @Post("create")
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const accessToken = jwt.sign({ email: createUserDto.email }, JWT_SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ email: createUserDto.email }, JWT_REFRESH_SECRET, { expiresIn: '30d' });

    res.cookie('accessToken', accessToken, { httpOnly: true });

    return this.userService.create(createUserDto, refreshToken);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post("login")
  async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
    const accessToken = jwt.sign({ email: body.email }, JWT_SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ email: body.email }, JWT_REFRESH_SECRET, { expiresIn: '30d' });

    res.cookie('accessToken', accessToken, { httpOnly: true });

    return this.userService.login(body.email, body.password, refreshToken);
  }

  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post("logout")
  async logout(@Body() email: string, @Res() res: Response) {
    res.clearCookie('token');
    this.userService.logout(email);
    return { message: "success" };
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Access token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Get("refresh")
  async refresh(@Res() res: Response, @Req() req: Request) {
    try {
      const accessToken = req.cookies["accessToken"];
      if (!accessToken) {
        throw new UnauthorizedException("Access token missing");
      }

      const decoded = jwt.verify(accessToken, JWT_SECRET_KEY) as any;
      const email = decoded.email;

      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      const isValid = await this.userService.verifyRefreshToken(user.refreshToken);
      if (!isValid) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const newTokens = jwt.sign({ email }, JWT_SECRET_KEY, { expiresIn: '1h' });

      res.cookie('accessToken', newTokens, { httpOnly: true });

      return res.json({ message: "success" });
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({ status: 200, description: 'User info retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get("userInfo")
  async userInfo(@Res() res: Response, @Req() req: Request) {
    try {
      const accessToken = req.cookies["accessToken"];
      if (!accessToken) {
        throw new UnauthorizedException("Access token missing");
      }

      const decoded = jwt.verify(accessToken, JWT_SECRET_KEY) as any;
      const email = decoded.email;

      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      return res.json(user);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
}
