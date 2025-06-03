import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'src/notes/entities/note.entity';
import { PaysModule } from './pays/pays.module';
import { Pay } from 'src/pays/entities/pay.entity';

@Module({
  imports: [
    NotesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Note, Pay],
        synchronize: process.env.NODE_ENV !== 'production', // Chỉ dùng cho development
      }),
    }),
    PaysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
