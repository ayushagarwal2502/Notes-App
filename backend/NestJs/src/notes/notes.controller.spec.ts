import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import {NotesService} from './notes.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);
describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [NotesService]
    
    }).compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
