import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmailUserAdmin(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.usersService.updateRefreshToken(
      user.id,
      await this.hashPassword(refreshToken),
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<RegisterResponse> {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmailUserAdmin(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = await this.usersService.createUserAdmin(
      email,
      passwordHash,
      name,
    );

    // Return user without password
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async refreshTokens(refreshToken: string): Promise<LoginResponse> {
    try {
      const payload = this.jwtService.verify<{
        sub: string;
        email: string;
      }>(refreshToken);
      const user = await this.usersService.findOneUserAdmin(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }

      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken ?? '',
      );

      if (!isRefreshTokenMatching) {
        // Reuse Detected - Invalidate tokens
        await this.usersService.updateRefreshToken(user.id, null);
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
      };

      const accessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      await this.usersService.updateRefreshToken(
        user.id,
        await this.hashPassword(newRefreshToken),
      );

      return {
        access_token: accessToken,
        refresh_token: newRefreshToken,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }
}
