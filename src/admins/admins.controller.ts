import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { SearchAdminDto } from './dto/search-admin.dto';
import { Admin } from './schemas/admin.schema';
import { SignInAdminDto } from './dto/signin-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../common/guards/AdminGuard';
import { SelfGuard } from '../common/guards/SelfGuard';
import { SuperAdminGuard } from '../common/guards/SuperAdminGuard';

@ApiTags('admins')
@ApiBearerAuth() // Specify that JWT Bearer tokens are used for authentication
@ApiSecurity('bearerAuth') // Reference the security scheme defined above
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('auth/signup')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateAdminDto,
    description: 'Admin creation data including profile image upload',
  })
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({
    status: 201,
    description: 'The admin has been successfully created.',
    type: Admin,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(
    @Body() createAdminDto: CreateAdminDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.adminsService.create(createAdminDto, image);
  }

  @Post('auth/signin')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Login an admin' })
  @ApiResponse({
    status: 200,
    description: 'The admin has been successfully logged in',
    schema: {
      example: {
        id: '3904tjgv09cg4g5',
        token: 'kalvlnlfvsfjvjfvgnjfvbgfk;qaa[[a',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  login(@Body() signInAdminDto: SignInAdminDto) {
    return this.adminsService.login(signInAdminDto);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search for admins' })
  @ApiResponse({ status: 200, description: 'Search results', type: [Admin] })
  async search(@Query() searchAdminDto: SearchAdminDto): Promise<Admin[]> {
    return this.adminsService.search(searchAdminDto);
  }

  @Get('auth/getme')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get the current admin by token' })
  @ApiResponse({ status: 200, description: 'Admin found', type: Admin })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  getMe(@Headers('Authorization') token: string) {
    return this.adminsService.getme(token);
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an admin by ID' })
  @ApiResponse({ status: 200, description: 'Admin found', type: Admin })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  findOne(@Param('id') id: string) {
    return this.adminsService.findById(id);
  }

  @Put(':id')
  @UseGuards(SelfGuard) // Guard to ensure admin can only update their own profile
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateAdminDto,
    description: 'Admin update data including optional profile image upload',
  })
  @ApiOperation({ summary: 'Update an admin by ID' })
  @ApiResponse({
    status: 200,
    description: 'Admin successfully updated',
    type: Admin,
  })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.adminsService.update(id, updateAdminDto, image);
  }

  @Delete(':id')
  @UseGuards(SuperAdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an admin by ID' })
  @ApiResponse({ status: 204, description: 'Admin successfully removed' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  remove(@Param('id') id: string) {
    return this.adminsService.remove(id);
  }
}
