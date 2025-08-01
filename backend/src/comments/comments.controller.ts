import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { BadRequestException } from '@nestjs/common';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yorum oluştur' })
  @ApiResponse({ status: 201, description: 'Yorum oluşturuldu' })
  @ApiResponse({ status: 400, description: 'Geçersiz veri' })
  @ApiResponse({ status: 404, description: 'Kullanıcı veya iş bulunamadı' })
  async create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentsService.create(createCommentDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm yorumları listele' })
  @ApiQuery({ name: 'commentedUserId', required: false })
  @ApiQuery({ name: 'commenterId', required: false })
  @ApiQuery({ name: 'jobId', required: false })
  @ApiQuery({ name: 'rating', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Yorumlar listelendi' })
  async findAll(@Query() filters: any) {
    return this.commentsService.findAll(filters);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Belirli bir kullanıcının aldığı yorumları listele' })
  @ApiResponse({ status: 200, description: 'Kullanıcının yorumları listelendi' })
  async getUserComments(@Param('userId') userId: string) {
    // UUID formatını kontrol et
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      throw new BadRequestException(`Geçersiz UUID formatı: ${userId}`);
    }
    return this.commentsService.getUserComments(userId);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kendi yaptığım yorumları listele' })
  @ApiResponse({ status: 200, description: 'Yorumlarım listelendi' })
  async getMyComments(@Request() req) {
    return this.commentsService.getMyComments(req.user.sub);
  }

  @Get('job/:jobId')
  @ApiOperation({ summary: 'Belirli bir işe ait yorumları listele' })
  @ApiResponse({ status: 200, description: 'İş yorumları listelendi' })
  async getJobComments(@Param('jobId') jobId: string) {
    // UUID formatını kontrol et
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(jobId)) {
      throw new BadRequestException(`Geçersiz UUID formatı: ${jobId}`);
    }
    return this.commentsService.getJobComments(jobId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Yorum detayı' })
  @ApiResponse({ status: 200, description: 'Yorum detayı' })
  @ApiResponse({ status: 404, description: 'Yorum bulunamadı' })
  async findById(@Param('id') id: string) {
    // UUID formatını kontrol et
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException(`Geçersiz UUID formatı: ${id}`);
    }
    return this.commentsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yorumu güncelle' })
  @ApiResponse({ status: 200, description: 'Yorum güncellendi' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'Yorum bulunamadı' })
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Request() req) {
    return this.commentsService.update(id, updateCommentDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yorumu sil' })
  @ApiResponse({ status: 200, description: 'Yorum silindi' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'Yorum bulunamadı' })
  async delete(@Param('id') id: string, @Request() req) {
    return this.commentsService.delete(id, req.user.sub);
  }
} 