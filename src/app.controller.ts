import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Get,
  Req,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { AwsService } from './aws.service';

@Controller()
export class AppController {
  constructor(private readonly awsService: AwsService) {}

  @Get()
  getHello(): string {
    return 'hello, aws s3';
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadMediaFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return await this.awsService.uploadFileToS3('cats', file);
  }

  @Get('cats')
  getImageUrl(@Body('key') key: string) {
    return this.awsService.getAwsS3FileUrl(key);
  }
}
