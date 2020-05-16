import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp(authCredentialDto: AuthCredentialDto) {
    return this.userRepository.signUp(authCredentialDto);
  }

  async signIn(authCredentialDto: AuthCredentialDto) {
    const username = await this.userRepository.validatePassword(
      authCredentialDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid credential');
    }

    const payload = { username };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
