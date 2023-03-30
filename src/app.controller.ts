import { Controller, Get, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Category } from './categories/interfaces/category.interface';

const ackErrors: string[] = ['E11000']

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  private readonly logger = new Logger(AppController.name)


}
