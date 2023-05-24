import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import noteDto from '../dto/notes.dto';
import { Broker } from '../rmq/broker';
import ResponseModel from '../rmq/responseModel';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Notes } from './notes.entity';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  private broker = Broker.getInstance();
  //Topics We need for the controller
  private topicArray = ['NOTES_ADD', 'NOTES_UPDATE', 'NOTES_DELETE'];
  private serviceName = ['IOT_SERVICE', 'IOT_SERVICE', 'IOT_SERVICE'];

  constructor(private notesService: NotesService) {
    this.module_init();
  }

  async module_init() {
    for (var i = 0; i < this.topicArray.length; i++) {
      this.broker.listenToService(
        this.topicArray[i],
        this.serviceName[i],
        (() => {
          var value = this.topicArray[i];
          return async (result) => {
           // dto used to define how the data will be sent over network using typescript
            let responseModelwithDto: ResponseModel<noteDto>;
            try {
              //to check what user has requested to perform and select the case accordingly
              switch (value) {
                case 'NOTES_ADD':
                  this.notesService.create(result.message.note);
                  break;
                case 'NOTES_UPDATE':
                  var uid = result.message.id;
                  this.notesService.update(uid, result.message);
                  break;
                case 'NOTES_DELETE':
                  var id = result.message;
                  this.notesService.delete(id);
                  break;
              }
              responseModelwithDto = result;
              // borker
              for (var i = 0; i < result.OnSuccessTopicsToPush.length; i++) {
                const topicName = result.OnSuccessTopicsToPush[i];
                this.broker.PublicMessageToTopic(
                  topicName,
                  responseModelwithDto,
                );
              }
            } catch (error) {
              console.log('Error Occured while listening to queues');
              console.log(error, result);
              for (var i = 0; i < result.OnFailureTopicsToPush.length; i++) {
                const topicName = result.OnFailureTopicsToPush[i];
                this.broker.PublicMessageToTopic(
                  topicName,
                  responseModelwithDto,
                );
              }
            }
          };
        })(),
      );
    }
  }
  //add, update and delete done using rabbitMq but not get.
  @Get()
  findAll(): Promise<Notes[]> {
    return this.notesService.findAll();
  }
}
