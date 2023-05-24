import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Notes } from './notes/notes.entity';
import { NotesController } from './notes/notes.controller';
import { NotesService } from './notes/notes.service';

@Module({
  imports: [TypeOrmModule.forRoot({
    
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Ayush0921',
    database: 'MyNewDb',
    synchronize: true,
    logging:true,
    entities: [Notes],
  }),NotesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
