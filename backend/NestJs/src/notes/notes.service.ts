import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Notes } from './notes.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Notes)
     private readonly NotesRepository: Repository<Notes>,
    
  ) {}
// now here we will create functions to add the note in DB i.e. in the table we create

  findAll(): Promise<Notes[]> {
    return this.NotesRepository.find();
  }

  //observable is most powerful for better user experience using RxJS pub-sub architecture
  create(e): Observable<Notes> {
    const notes1: Notes = new Notes();
    notes1.note = e;
    return from(this.NotesRepository.save(notes1));
  }

  update(id: number, note: Notes): Observable<UpdateResult> {
    return from(this.NotesRepository.update(id, note));
  }
  delete(id: number): Observable<DeleteResult> {
    return from(this.NotesRepository.delete(id));
  }
}
