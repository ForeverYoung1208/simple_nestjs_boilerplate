import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';
import { ResponseTokenDto } from './dto/response-token.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { JwtUserPayloadDto } from './dto/jwt-user-payload.dto';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AccessForbiddenException,
  AccessTokenGenerationException,
} from '../../exceptions/access-exceptions';

@Injectable()
export class AuthService {
  protected readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async signAsync(payload: object, options?: JwtSignOptions): Promise<string> {
    return this.jwtService.signAsync(payload, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validateUser(email: string, _password: string): Promise<User> {
    const user: User | null = await this.usersRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new AccessForbiddenException('Invalid login or password');
    }

    // use mocked (simplified) auth - allow all users regardles of password
    // TODO: remove this after real auth implementation

    // const passwordIsValid = await this.hashService.compareHashed(
    //   password,
    //   user.password,
    // );
    // if (!passwordIsValid) {
    //   throw new AccessForbiddenException('Invalid login or password');
    // }

    return user;
  }

  async signin(payloadUser: JwtUserPayloadDto): Promise<ResponseTokenDto> {
    const dbUser: User | null = await this.usersRepository.findOneBy({
      id: payloadUser._id,
    });

    if (!dbUser) {
      throw new AccessForbiddenException('access denied');
    }

    return this.generateTokens(payloadUser);
  }

  async generateTokens(
    userPayload: JwtUserPayloadDto,
  ): Promise<ResponseTokenDto> {
    const accessToken = await this.generateAccessToken({
      sub: userPayload._id,
    });

    const refreshToken = await this.generateRefreshToken({
      sub: userPayload._id,
    });

    return { accessToken, refreshToken };
  }

  async generateAccessToken(payload: JwtPayloadDto): Promise<string> {
    const secret = this.configService.get<string>('JWT_SECRET_KEY');
    const expiresIn = this.configService.get<string>('ACCESS_TOKEN_TTL');
    if (!secret || !expiresIn) {
      throw new AccessTokenGenerationException(
        'JWT_SECRET_KEY or ACCESS_TOKEN_TTL is not defined',
      );
    }

    return this.generateJwtToken(payload, secret, expiresIn);
  }

  async generateRefreshToken(payload: JwtPayloadDto): Promise<string> {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET_KEY');
    const expiresIn = this.configService.get<string>('REFRESH_TOKEN_TTL');
    if (!secret || !expiresIn) {
      throw new AccessTokenGenerationException(
        'JWT_REFRESH_SECRET_KEY or REFRESH_TOKEN_TTL is not defined',
      );
    }

    return this.generateJwtToken(payload, secret, expiresIn);
  }

  async generateJwtToken(
    payload: JwtPayloadDto,
    secret: string,
    expiresIn: string,
  ): Promise<string> {
    try {
      return await this.signAsync(payload, {
        secret,
        expiresIn,
      });
    } catch (e) {
      throw new AccessTokenGenerationException(e.message);
    }
  }

  async refresh(payloadUser: JwtUserPayloadDto): Promise<ResponseTokenDto> {
    const dbUser: User | null = await this.usersRepository.findOneBy({
      id: payloadUser._id,
    });

    if (!dbUser) {
      throw new AccessForbiddenException('access denied');
    }

    const updatedPayload: JwtUserPayloadDto = {
      _id: String(dbUser.id),
    };

    return this.generateTokens(updatedPayload);
  }
}
