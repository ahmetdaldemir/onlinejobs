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

    // Email ve telefon kontrolü - userType'a göre
    let existingUser;
    
    if (userType === 'employer') {
      // Employer için email ve telefon kontrolü
      existingUser = await this.userRepository.findOne({
        where: [
          { email, userType },
          { phone, userType }
        ],
      });
    } else {
      // Worker için sadece telefon kontrolü
      existingUser = await this.userRepository.findOne({
        where: { phone, userType },
      });
    }

    console.log('existingUser',existingUser);
    if (existingUser) {
      if (userType === 'employer') {
        throw new ConflictException('Email veya telefon numarası zaten kullanımda');
      } else {
        throw new ConflictException('Telefon numarası zaten kullanımda');
      }
    }

    // Şifre hash'leme
    const hashedPassword = await bcrypt.hash(password, 12);

    // Kullanıcı oluşturma
    const user = this.userRepository.create({
      ...rest,
      email: userType === 'employer' ? email : null, // Worker için email null olabilir
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
        categories: savedUser.categories ? savedUser.categories.map(category => ({
          id: category.id,
          name: category.name,
        })) : [],
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
      relations: ['categories','userInfos'],
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
        categories: user.categories ? user.categories.map(category => ({
          id: category.id,
          name: category.name,
        })) : [],
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
      relations: ['categories','userInfos'],
    });

    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    return user;
  }


    async checkPhone(checkPhoneDto: CheckPhoneDto): Promise<{ message: string; status: string; statusCode: number }> {
    const { phone,userType } = checkPhoneDto;

    const existingUser = await this.userRepository.findOne({
      where: { phone,userType },
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