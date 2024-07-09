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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { SearchAdminDto } from './dto/search-admin.dto';
import { Admin } from './schemas/admin.schema';
import { SignInAdminDto } from './dto/signin-admin.dto';

@ApiTags('admins')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('auth/signup')
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
    description: 'The admin has ben successfuly login',
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search for admins' })
  @ApiResponse({ status: 200, description: 'Search results', type: [Admin] })
  @ApiResponse({ status: 400, description: 'Invalid search query.' })
  async search(@Query() searchAdminDto: SearchAdminDto): Promise<Admin[]> {
    return this.adminsService.search(searchAdminDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an admin by ID' })
  @ApiResponse({ status: 200, description: 'Admin found', type: Admin })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  findOne(@Param('id') id: string) {
    return this.adminsService.findById(id);
  }

  @Put(':id')
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an admin by ID' })
  @ApiResponse({ status: 204, description: 'Admin successfully removed' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  remove(@Param('id') id: string) {
    return this.adminsService.remove(id);
  }
}
