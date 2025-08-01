import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isActive: true, parentId: IsNull() },
      order: { orderIndex: 'ASC' },
      relations: ['subCategories'],
    });
  }

  async findAllWithInactive(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { parentId: IsNull() },
      order: { orderIndex: 'ASC' },
      relations: ['subCategories'],
    });
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['subCategories'],
    });

    if (!category) {
      throw new NotFoundException('Kategori bulunamadı');
    }

    return category;
  }

  async create(createCategoryDto: any): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category as unknown as Category);
  }

  async update(id: string, updateCategoryDto: any): Promise<Category> {
    const category = await this.findById(id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async delete(id: string): Promise<void> {
    const category = await this.findById(id);
    category.isActive = false;
    await this.categoryRepository.save(category);
  }

  async clearAll(): Promise<void> {
    await this.categoryRepository.clear();
  }

  async findByParentId(parentId: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { parentId, isActive: true },
      order: { orderIndex: 'ASC' },
    });
  }
} 