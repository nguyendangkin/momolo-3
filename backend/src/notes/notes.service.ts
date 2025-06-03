import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/notes/entities/note.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly usersRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto) {
    try {
      const data = {
        uuid: uuidv4(),
        content: createNoteDto.content,
      };

      const note = await this.usersRepository.create(data);
      const result = await this.usersRepository.save(note);

      if (!result.uuid) {
        throw new BadRequestException('Lỗi khi tạo Note');
      }

      return {
        uuid: result.uuid,
      };
    } catch (error) {
      throw new BadRequestException('Lỗi khi tạo Note');
    }
  }

  async findOne(uuid: string) {
    try {
      const note = await this.usersRepository.findOne({
        where: { uuid: uuid },
      });

      if (!note) {
        throw new BadRequestException('Không tìm thấy Note');
      }

      return {
        content: note.content,
      };
    } catch (error) {
      throw new BadRequestException('Lỗi khi tìm Note');
    }
  }
}
