import { HttpExceptionFilter } from 'src/common/execptions/http-exception.filter';
import { CatsService } from '../services/cats.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PosiviceIntPipe } from 'src/common/pipes/positiveInt.pipe';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CatRequestDto } from '../dto/cats.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadOnlyCatDto } from '../dto/cat.dto';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Request } from 'express';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer.options';
import { Cat } from '../cats.schema';
// import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 고양이 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentCat(@CurrentUser() cat) {
    return cat.readOnlyData;
  }

  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @ApiResponse({
    status: 200,
    description: '성공!',
    type: ReadOnlyCatDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() body: CatRequestDto) {
    return await this.catsService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogIn(data);
  }

  // @ApiOperation({ summary: '로그아웃' })
  // @Post('logout')
  // logOut() {
  //   return 'logout';
  // }

  // @ApiOperation({ summary: '고양이 이미지 업로드' })
  // @UseInterceptors(
  //   AmazonS3FileInterceptor('image', {
  //     dynamicPath: 'cats',
  //   }),
  // )
  // @UseGuards(JwtAuthGuard)
  // @Post('upload')
  // uploadCatImg(
  //   @UploadedFile() file: Array<Express.Multer.File>,
  //   @CurrentUser() cat: Cat,
  // ) {
  //   console.log(file);
  //   // return 'uploadImg';
  //   // return { image: `http://localhost:8000/media/cats/${files[0].filename}` };
  //   return this.catsService.uploadImg(cat, file);
  // }

  @ApiOperation({ summary: '모든 고양이 가져오기' })
  @Get('all')
  getAllCat() {
    return this.catsService.getAllCat();
  }
}
