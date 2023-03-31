import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync(
      {
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const MG_USER = configService.get<string>('MG_USER')
          const MG_PASSWORD = configService.get<string>('MG_PASSWORD')
          const MG_URL = configService.get<string>('MG_URL')
          const MG_DB_NAME = configService.get<string>('MG_DB_NAME')
          const uri = `mongodb://${MG_USER}:${MG_PASSWORD}@${MG_URL}`
          return {
            uri,
            dbName: MG_DB_NAME
          }
        }
      }
    ),
    CategoriesModule,
    PlayersModule,
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [],
  providers: []
})
export class AppModule { }
