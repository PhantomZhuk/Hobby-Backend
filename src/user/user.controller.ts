import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'User already exists' })
  @Post("create")
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const accessToken = jwt.sign({ email: createUserDto.email }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ email: createUserDto.email }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' });

    await this.userService.create(createUserDto, refreshToken)

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true })

    return res.status(201).json({ message: "User created successfully" });
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post("login")
  async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
    const accessToken = jwt.sign({ email: body.email }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ email: body.email }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' });

    await this.userService.login(body.email, body.password, refreshToken)

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true })

    return res.status(200).json({ message: "User logged in successfully" });
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
        throw new Error("Access token missing");
      }

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY!) as any;
      const email = decoded.email;

      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      const isValid = await this.userService.verifyRefreshToken(user.refreshToken);
      if (!isValid) {
        throw new Error("Invalid refresh token");
      }

      const newTokens = jwt.sign({ email }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });

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
        throw new Error("Access token missing");
      }

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY!) as any;

      if (!decoded) {
        throw new Error("Invalid access token");
      }

      const email = decoded.email;

      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  @ApiOperation({ summary: 'Verify access token' })
  @ApiResponse({ status: 200, description: 'Access token verified successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get("verifyToken")
  async verifyToken(@Res() res: Response, @Req() req: Request) {
    try {
      const accessToken = req.cookies["accessToken"];
      if (!accessToken) {
        throw new Error("Access token missing");
      }

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY!) as any;

      if (!decoded) {
        throw new Error("Invalid access token");
      }

      return res.status(200).json({ message: "success" });
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  @Post("updateUser")
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Res() res: Response, @Req() req: Request) {
    try {
      const accessToken = req.cookies["accessToken"];

      if (!accessToken) {
        throw new Error("Access token missing");
      }

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY!) as any;

      if (!decoded) {
        throw new Error("Invalid access token");
      }

      const user = await this.userService.updateUser(decoded.email, updateUserDto);

      return res.status(200).json(user);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
}
