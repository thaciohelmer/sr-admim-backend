import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';

const uri = 'mongodb://thaciohelmer:thaciohelmer123@localhost:27017'

@Module({
  imports: [
    MongooseModule.forRoot(
      uri,
      {
        dbName: 'sr_adm_backend'
      }
    ),
    CategoriesModule,
    PlayersModule,
  ],
  controllers: [],
  providers: []
})
export class AppModule { }
