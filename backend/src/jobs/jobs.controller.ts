import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, ForbiddenException, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import { ApplicationStatus } from './entities/job-application.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '@nestjs/common';
import { JobStatus } from './entities/job.entity';
import { UploadService } from '../upload/upload.service';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly usersService: UsersService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İş ilanı oluştur (Sadece employer\'lar)' })
  @ApiResponse({ status: 201, description: 'İş ilanı oluşturuldu' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'description'],
      properties: {
        title: { type: 'string', description: 'İş başlığı' },
        description: { type: 'string', description: 'İş açıklaması' },
        budget: { type: 'string', description: 'Bütçe' },
        scheduledDate: { type: 'string', format: 'date', description: 'Planlanan tarih' },
        scheduledTime: { type: 'string', description: 'Planlanan saat' },
        isUrgent: { type: 'boolean', description: 'Acil mi?' },
        categoryId: { type: 'string', format: 'uuid', description: 'Kategori ID' },
        userInfoId: { type: 'string', format: 'uuid', description: 'Konum bilgisi ID' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'İş ilanı resimleri (max 5 adet, her biri max 5MB)',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images', 5))
  async create(
    @Body() createJobDto: CreateJobDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Request() req,
  ) {
    // Sadece employer'ların iş ilanı oluşturabilmesini kontrol et
    const user = await this.usersService.findById(req.user.sub);
    if (user.userType !== 'employer') {
      throw new ForbiddenException('Sadece employer\'lar iş ilanı oluşturabilir');
    }

    return this.jobsService.createWithImages(createJobDto, images, req.user.sub);
  }

  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İş ilanlarını listele (Worker\'lar için kategorilerine göre filtrelenir)' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'employerId', required: false })
  @ApiQuery({ name: 'latitude', required: false, type: Number })
  @ApiQuery({ name: 'longitude', required: false, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'İş ilanları listelendi' })
  async findAll(@Query() filters: any, @Request() req) {
    let user = null;
    
    // Eğer JWT token varsa kullanıcı bilgisini al
    if (req.user) {
      try {
        user = await this.usersService.findById(req.user.sub);
        console.log('👤 Kullanıcı bilgisi alındı:', {
          id: user.id,
          userType: user.userType,
          categoryIds: user.categoryIds
        });
      } catch (error) {
        console.log('⚠️ Kullanıcı bilgisi alınamadı:', error.message);
      }
    } else {
      console.log('👤 Kullanıcı girişi yapılmamış, tüm işler gösterilecek');
    }
    
    return this.jobsService.findAll(filters, user);
  }

  @Get('my/applications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kendi başvurularımı listele' })
  @ApiResponse({ status: 200, description: 'Başvurular listelendi' })
  async getMyApplications(@Request() req) {
    return this.jobsService.getMyApplications(req.user.sub);
  }

  @Get('my/jobs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Oluşturduğum iş ilanlarını listele' })
  @ApiResponse({ status: 200, description: 'İş ilanları listelendi' })
  async getMyJobs(@Request() req) {
    return this.jobsService.getMyJobs(req.user.sub);
  }

  @Get('my/jobs/applications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Employer: İş ilanlarıma gelen başvuruları listele' })
  @ApiResponse({ status: 200, description: 'İş ilanlarıma gelen başvurular listelendi' })
  async getMyJobsApplications(@Request() req) {
    return this.jobsService.getMyJobsApplications(req.user.sub);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Öne çıkan işleri getir (Admin tarafından seçilen)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Kaç adet iş getirileceği' })
  @ApiResponse({ status: 200, description: 'Öne çıkan işler listelendi' })
  async getFeaturedJobs(@Query('limit') limit: number = 10) {
    return this.jobsService.getFeaturedJobs(limit);
  }

  @Get('high-score')
  @ApiOperation({ summary: 'Yüksek skorlu işleri getir (Sistem otomatik seçimi)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Kaç adet iş getirileceği' })
  @ApiResponse({ status: 200, description: 'Yüksek skorlu işler listelendi' })
  async getHighScoreJobs(@Query('limit') limit: number = 10) {
    return this.jobsService.getHighScoreJobs(limit);
  }

  @Post(':id/featured')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İşi öne çıkar/çıkar (Admin yetkisi gerekli)' })
  @ApiResponse({ status: 200, description: 'İş öne çıkarma durumu güncellendi' })
  async setFeatured(
    @Param('id') jobId: string,
    @Body() data: { isFeatured: boolean; reason?: string },
    @Request() req
  ) {
    // Admin kontrolü (basit implementasyon)
    const user = await this.usersService.findById(req.user.sub);
    if (user.userType !== 'admin') {
      throw new ForbiddenException('Bu işlem için admin yetkisi gerekli');
    }

    return this.jobsService.setFeatured(jobId, data.isFeatured, data.reason);
  }

  @Post(':id/view')
  @ApiOperation({ summary: 'İş görüntülenme sayısını artır' })
  @ApiResponse({ status: 200, description: 'Görüntülenme sayısı artırıldı' })
  async incrementViewCount(@Param('id') jobId: string) {
    return this.jobsService.incrementViewCount(jobId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'İş ilanı detayı' })
  @ApiResponse({ status: 200, description: 'İş ilanı detayı' })
  @ApiResponse({ status: 404, description: 'İş ilanı bulunamadı' })
  @ApiResponse({ status: 400, description: 'Geçersiz UUID formatı' })
  async findById(@Param('id') id: string) {
    // UUID formatını kontrol et
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException(`Geçersiz UUID formatı: ${id}. Lütfen geçerli bir iş ilanı ID'si girin.`);
    }
    return this.jobsService.findById(id);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İş ilanına resim ekle' })
  @ApiResponse({ status: 200, description: 'Resimler eklendi' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'İş ilanı resimleri (max 5 adet, her biri max 5MB)',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images', 5))
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Request() req,
  ) {
    if (!images || images.length === 0) {
      throw new BadRequestException('En az bir resim yüklemelisiniz');
    }
    return this.jobsService.addImages(id, images, req.user.sub);
  }

  @Delete(':id/images/:filename')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İş ilanından resim sil' })
  @ApiResponse({ status: 200, description: 'Resim silindi' })
  async deleteImage(
    @Param('id') id: string,
    @Param('filename') filename: string,
    @Request() req,
  ) {
    return this.jobsService.deleteImage(id, filename, req.user.sub);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İş ilanını güncelle' })
  @ApiResponse({ status: 200, description: 'İş ilanı güncellendi' })
  async update(@Param('id') id: string, @Body() updateJobDto: any, @Request() req) {
    return this.jobsService.update(id, updateJobDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İş ilanını sil' })
  @ApiResponse({ status: 200, description: 'İş ilanı silindi' })
  async delete(@Param('id') id: string, @Request() req) {
    return this.jobsService.delete(id, req.user.sub);
  }

  @Post(':id/apply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İş için başvuru yap' })
  @ApiResponse({ status: 201, description: 'Başvuru yapıldı' })
  async applyForJob(@Param('id') jobId: string, @Body() applicationData: CreateJobApplicationDto, @Request() req) {
    return this.jobsService.applyForJob(jobId, req.user.sub, applicationData);
  }

  @Put('applications/:id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Başvuru durumunu güncelle' })
  @ApiResponse({ status: 200, description: 'Başvuru durumu güncellendi' })
  async updateApplicationStatus(
    @Param('id') applicationId: string,
    @Body('status') status: ApplicationStatus,
    @Request() req,
  ) {
    return this.jobsService.updateApplicationStatus(applicationId, status, req.user.sub);
  }

  @Get(':id/applications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İş ilanının başvurularını listele' })
  @ApiResponse({ status: 200, description: 'Başvurular listelendi' })
  async getJobApplications(@Param('id') jobId: string, @Request() req) {
    return this.jobsService.getJobApplications(jobId, req.user.sub);
  }

  @Get('debug/location')
  async debugLocation() {
    // Tüm job'ları getir
    const allJobs = await this.jobsService.findAll({
      relations: ['userInfo'],
      where: { status: JobStatus.OPEN }
    });

    // UserInfo'da konum bilgisi olan job'ları filtrele
    const jobsWithLocation = allJobs.filter(job => 
      job.userInfo && 
      job.userInfo.latitude && 
      job.userInfo.longitude
    );

    return {
      totalJobs: allJobs.length,
      jobsWithLocation: jobsWithLocation.length,
      jobsWithLocationDetails: jobsWithLocation.map(job => ({
        id: job.id,
        title: job.title,
        userInfoId: job.userInfoId,
        latitude: job.userInfo?.latitude,
        longitude: job.userInfo?.longitude,
        address: job.userInfo?.address
      }))
    };
  }
} 