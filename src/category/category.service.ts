import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schemas';
import { Model } from 'mongoose';
import { checkId } from '../common/utils/check-mongodbId';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}
  create(createCategoryDto: CreateCategoryDto) {
    createCategoryDto.name = createCategoryDto.name.toLocaleLowerCase();
    return this.categoryModel.create(createCategoryDto);
  }

  findAll() {
    return this.categoryModel.find();
  }

  async findOne(id: string) {
    checkId(id);
    const find = await this.categoryModel.findById(id);
    if (!find) throw new NotFoundException('Kateroya topilmadi!');

    return find;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    checkId(id);
    const find = await this.categoryModel.findById(id);
    if (!find) throw new NotFoundException('Kateroya topilmadi!');
    return this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
      new: true,
    });
  }

  async remove(id: string) {
    checkId(id);
    const find = await this.categoryModel.findById(id);
    if (!find) throw new NotFoundException('Kateroya topilmadi!');
    return 'Muvoffaqiyatli o`chirildi';
  }
}
