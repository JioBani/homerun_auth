import { Body, Controller, Get, Headers,  Post } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginWithKakaoDto } from './model/kakao-login.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('kakao')
  async loginWithKakao(
    @Headers('Authorization') accessToken: string,
    @Body() loginWithKakaoDto: LoginWithKakaoDto,
  ){
    return await this.appService.loginWithKakao(accessToken , loginWithKakaoDto);
  }

  @Post('/naver')
  async loginWithNaver(
    @Headers('Authorization') accessToken: string,
    @Body() loginWithKakaoDto: LoginWithKakaoDto,
  ){
    return await this.appService.loginWithNaver(accessToken , loginWithKakaoDto);
  }
}
