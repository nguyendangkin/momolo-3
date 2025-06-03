import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePayDto {
  @IsNotEmpty({ message: 'username không được để trống' })
  @IsString({ message: 'Nội dung phải là chuỗi' })
  @MinLength(1, {
    message: 'Phải có ít nhất 1 ký tự',
  })
  @MaxLength(40, {
    message: 'Giới hạn là 40 ký tự',
  })
  username: string;

  @IsNotEmpty({ message: 'Số tiền không được để trống' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Số tiền phải là số' })
  money: number;
}
