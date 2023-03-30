import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';

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
  ],
  controllers: [],
  providers: []
})
export class AppModule { }
