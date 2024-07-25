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
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from './schemas/contract.schemas';

@ApiTags('contracts')
@ApiBearerAuth()
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contract' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The contract has been successfully created.',
    type: Contract,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiBody({ type: CreateContractDto })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createContractDto: CreateContractDto,
    @Headers('Authorization') token: string,
  ) {
    return this.contractService.create(createContractDto, token);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all contracts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of contracts',
    type: [Contract],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  findAll() {
    return this.contractService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a contract by ID' })
  @ApiParam({ name: 'id', description: 'Contract ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The contract has been successfully retrieved.',
    type: Contract,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contract not found',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  findOne(@Param('id') id: string) {
    return this.contractService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contract by ID' })
  @ApiParam({ name: 'id', description: 'Contract ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The contract has been successfully updated.',
    type: Contract,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contract not found',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiBody({ type: UpdateContractDto })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
    @Headers('Authorization') token: string,
  ) {
    return this.contractService.update(id, updateContractDto, token);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contract by ID' })
  @ApiParam({ name: 'id', description: 'Contract ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The contract has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Contract not found',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.contractService.remove(id);
  }
}
