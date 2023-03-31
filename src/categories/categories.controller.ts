import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { Category } from './interfaces/category.interface';

const ackErrors: string[] = ['E11000']


@Controller('categories')
export class CategoriesController {

  constructor(private readonly categoryServices: CategoriesService) { }

  logger = new Logger(CategoriesController.name)

  @EventPattern('create-category')
  async createCategory(@Payload() category: Category, @Ctx() context: RmqContext): Promise<void> {
    const channel = context.getChannelRef()
    const originalMessage = context.getMessage()
    try {
      await this.categoryServices.create(category)
      await channel.ack(originalMessage)
    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
      const verifyMessage = ackErrors.filter(err => error.message.includes(err))
      if (verifyMessage) {
        await channel.ack(originalMessage)
      }
    }
  }

  @MessagePattern('get-categories')
  async getCategoryById(@Payload() id: string, @Ctx() context: RmqContext): Promise<any> {
    const channel = context.getChannelRef()
    const originalMessage = context.getMessage()
    try {
      if (id) {
        return await this.categoryServices.getById(id)
      } else {
        return await this.categoryServices.getAll()
      }
    } finally {
      await channel.ack(originalMessage)
    }
  }

  @MessagePattern('get-category-by-name')
  async getCategoryByName(@Payload() categoryName: string, @Ctx() context: RmqContext): Promise<Category> {
    const channel = context.getChannelRef()
    const originalMessage = context.getMessage()
    try {
      return await this.categoryServices.getByName(categoryName)
    } finally {
      await channel.ack(originalMessage)
    }
  }

  @EventPattern('update-category')
  async updateCategory(
    @Payload() payload: { id: string, category: Category },
    @Ctx() context: RmqContext): Promise<void> {
    const channel = context.getChannelRef()
    const originalMessage = context.getMessage()

    try {
      await this.categoryServices.update(payload.id, payload.category)
      await channel.ack(originalMessage)
    } catch (error) {
      this.logger.error(`Error: ${error.message}`)
      const verifyMessage = ackErrors.filter(err => error.message.includes(err))
      if (verifyMessage) {
        await channel.ack(originalMessage)
      }
    }
  }

}
