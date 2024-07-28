import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schemas';
import { SearchProductDto } from './dto/search-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../common/guards/AdminGuard';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';

@ApiTags('products')
@ApiBearerAuth() // Add this line to enable bearer token authentication
@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('photo'))
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product creation details',
    type: CreateProductDto,
  })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.productsService.create(createProductDto, photo);
  }

  @Post('component')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('photo'))
  @ApiOperation({ summary: 'Create a new component' })
  @ApiResponse({
    status: 201,
    description: 'The component has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Component creation details',
    type: CreateComponentDto,
  })
  @HttpCode(HttpStatus.CREATED)
  createComponent(
    @Body() createComponentDto: CreateComponentDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.productsService.createComponent(createComponentDto, photo);
  }

  @Get('search')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search for products' })
  @ApiResponse({
    status: 200,
    description: 'Search results',
    type: [Product],
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async search(
    @Query() searchProductDto: SearchProductDto,
  ): Promise<Product[]> {
    return this.productsService.search(searchProductDto);
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the product',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('img'))
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product update details',
    type: UpdateProductDto,
  })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() img: Express.Multer.File,
  ) {
    return this.productsService.update(id, updateProductDto, img);
  }

  @Patch('component/:id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('photo'))
  @ApiOperation({ summary: 'Update a component' })
  @ApiParam({ name: 'id', description: 'Component ID' })
  @ApiResponse({
    status: 200,
    description: 'The component has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Component not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Component update details',
    type: UpdateComponentDto,
  })
  @HttpCode(HttpStatus.OK)
  updateComponent(
    @Param('id') id: string,
    @Body() updateComponentDto: UpdateComponentDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.productsService.updateComp(id, updateComponentDto, photo);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 204,
    description: 'The product has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
