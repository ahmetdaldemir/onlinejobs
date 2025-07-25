import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { RegisterDto, LoginDto, AuthResponseDto, CheckPhoneDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, phone, password, userType, ...rest } = registerDto;

    // Email ve telefon kontrolü
    const existingUser = await this.userRepository.findOne({
      where:  { phone, userType },
    });

    console.log('existingUser',existingUser);
    if (existingUser) {
      throw new ConflictException('Email veya telefon numarası zaten kullanımda');
    }

    // Şifre hash'leme
    const hashedPassword = await bcrypt.hash(password, 12);

    // Kullanıcı oluşturma
    const user = this.userRepository.create({
      ...rest,
      email,
      phone,
      userType,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // JWT token oluşturma
    const payload = { sub: savedUser.id, email: savedUser.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        phone: savedUser.phone,
        userType: savedUser.userType,
        status: savedUser.status,
        isVerified: savedUser.isVerified,
        isOnline: savedUser.isOnline,
        rating: savedUser.rating,
        totalReviews: savedUser.totalReviews,
        profileImage: savedUser.profileImage,
        bio: savedUser.bio,
        category: savedUser.category ? {
          id: savedUser.category.id,
          name: savedUser.category.name,
        } : undefined,
      },
      message: 'Kullanıcı başarıyla kayıt oldu',
      status: 'success',
      statusCode: 201,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> { 
    const { phone, password, userType } = loginDto;

    // Kullanıcıyı bul
    const user = await this.userRepository.findOne({
      where: { phone, userType },
      relations: ['category','userInfos'],
    });
 
    if (!user) {
      throw new UnauthorizedException('Geçersiz telefon numarası veya şifre');
    }

    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Geçersiz email veya şifre');
    }

    // JWT token oluşturma
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        status: user.status,
        isVerified: user.isVerified,
        isOnline: user.isOnline,
        rating: user.rating,
        totalReviews: user.totalReviews,
        profileImage: user.profileImage,
        bio: user.bio,
        category: user.category ? {
          id: user.category.id,
          name: user.category.name,
        } : undefined,
        userInfos: user.userInfos ? user.userInfos.map(userInfo => ({
          id: userInfo.id,
          name: userInfo.name,
          latitude: userInfo.latitude,
          longitude: userInfo.longitude,
          address: userInfo.address,
          neighborhood: userInfo.neighborhood,
          buildingNo: userInfo.buildingNo,
          floor: userInfo.floor,
          apartmentNo: userInfo.apartmentNo,
          description: userInfo.description,
        })) : [],
      },
      message: 'Giriş başarılı',
      status: 'success',
      statusCode: 200,
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['category','userInfos'],
    });

    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    return user;
  }


    async checkPhone(checkPhoneDto: CheckPhoneDto): Promise<{ message: string; status: string; statusCode: number }> {
    const { phone } = checkPhoneDto;

    const existingUser = await this.userRepository.findOne({
      where: { phone },
    });

    if (existingUser) {
      return {
        message: 'Telefon numarası zaten kullanımda',
        status: 'error',
        statusCode: 400,
      };
    }

    return {
      message: 'Telefon numarası kontrolü başarılı',
      status: 'success',
      statusCode: 200,
    };
  }
} 