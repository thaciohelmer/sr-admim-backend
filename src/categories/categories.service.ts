import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {

  constructor(@InjectModel('Category') private readonly categoryModel: Model<Category>) { }

  async create(category: Category): Promise<void> {
    try {
      const createdCategory = new this.categoryModel(category)
      await createdCategory.save()
    } catch (error) {
      throw new RpcException(error.message)
    }
  }

  async getAll(): Promise<Array<Category>> {
    try {
      return await this.categoryModel.find()
    } catch (error) {
      throw new RpcException(error.message)
    }
  }

  async getById(id: string): Promise<Category> {
    try {
      return await this.categoryModel.findById(id)
    } catch (error) {
      throw new RpcException(error.message)
    }
  }

  async update(id: string, category: Category): Promise<void> {
    try {
      await this.categoryModel.findOneAndUpdate({ _id: id }, { $set: category })
    } catch (error) {
      throw new RpcException(error.message)
    }
  }

}
