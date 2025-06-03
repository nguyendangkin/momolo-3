import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  @IsString({ message: 'Nội dung phải là chuỗi' })
  content: string;
}
