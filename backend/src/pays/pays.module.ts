import { Module } from '@nestjs/common';
import { PaysService } from './pays.service';
import { PaysController } from './pays.controller';
import { Pay } from 'src/pays/entities/pay.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Pay])],
  controllers: [PaysController],
  providers: [PaysService],
})
export class PaysModule {}
