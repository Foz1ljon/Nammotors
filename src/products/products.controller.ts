import {
  Controller,
  Get,
  Post,
  Body,
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

@ApiTags('products')
@ApiBearerAuth() // Add this line to enable bearer token authentication
@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  // @UseGuards(AdminGuard)
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

  @Get('search')
  // @UseGuards(AdminGuard)
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

  @Get('filter')
  // @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'filter for products' })
  @ApiResponse({
    status: 200,
    description: 'filter results',
    type: [Product],
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async filter(
    @Query() searchProductDto: SearchProductDto,
  ): Promise<Product[]> {
    return this.productsService.filterProduct(searchProductDto);
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
