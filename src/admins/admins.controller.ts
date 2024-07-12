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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { SearchAdminDto } from './dto/search-admin.dto';
import { Admin } from './schemas/admin.schema';
import { SignInAdminDto } from './dto/signin-admin.dto';
import { AdminGuard } from '../common/guards/AdminGuard';
import { SuperAdminGuard } from '../common/guards/SuperAdminGuard';
import { SelfGuard } from '../common/guards/SelfGuard';

@ApiTags('admins')
@ApiBearerAuth() // Specify that JWT Bearer tokens are used for authentication
@ApiSecurity('bearerAuth') // Reference the security scheme defined above
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('auth/signup')
  @UseGuards(SuperAdminGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({
    status: 201,
    description: 'The admin has been successfully created.',
    type: Admin,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @Post('auth/signin')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Login an admin' })
  @ApiResponse({
    status: 200,
    description: 'The admin has ben successfully logged in',
    type: Admin,
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
    type: Admin,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  login(@Body() signInAdminDto: SignInAdminDto) {
    return this.adminsService.login(signInAdminDto);
  }

  @Get('search')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search for admins' })
  @ApiResponse({ status: 200, description: 'Search results', type: [Admin] })
  async search(@Query() searchAdminDto: SearchAdminDto): Promise<Admin[]> {
    return this.adminsService.search(searchAdminDto);
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
  @ApiOperation({ summary: 'Update an admin by ID' })
  @ApiResponse({
    status: 200,
    description: 'Admin successfully updated',
    type: Admin,
  })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(id, updateAdminDto);
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
