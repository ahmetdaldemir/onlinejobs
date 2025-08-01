import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApplicationStatus } from './entities/job-application.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '@nestjs/common';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'İş ilanı oluştur (Sadece employer\'lar)' })
  @ApiResponse({ status: 201, description: 'İş ilanı oluşturuldu' })
  async create(@Body() createJobDto: CreateJobDto, @Request() req) {
    // Sadece employer'ların iş ilanı oluşturabilmesini kontrol et
    const user = await this.usersService.findById(req.user.sub);
    if (user.userType !== 'employer') {
      throw new ForbiddenException('Sadece employer\'lar iş ilanı oluşturabilir');
    }

    return this.jobsService.create(createJobDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'İş ilanlarını listele' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'employerId', required: false })
  @ApiQuery({ name: 'latitude', required: false, type: Number })
  @ApiQuery({ name: 'longitude', required: false, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'İş ilanları listelendi' })
  async findAll(@Query() filters: any) {
    return this.jobsService.findAll(filters);
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
} 