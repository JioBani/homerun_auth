import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { KakaoTokenInfoDto } from './model/kakao_token_info.dto';
import { isAxiosError } from 'axios';
import * as admin from 'firebase-admin';
import { KakaoUserInfoDto } from './model/kakao-user-info.dto';
import { LoginWithKakaoDto } from './model/kakao-login.dto';

@Injectable()
export class AppService {
  
  constructor(private readonly httpService: HttpService){}
  getHello(): string {
    return 'Hello World!';
  }

  async loginWithKakao(accessToken : string , loginWithKakaoDto : LoginWithKakaoDto){
    const url = 'https://kapi.kakao.com/v1/user/access_token_info'; //TODO 엑세스토큰 체크도 서버에서 할지 고민해보기

    await this.checkKakaoUser(accessToken , loginWithKakaoDto);

    return await this.createUserByKakao(loginWithKakaoDto);

  }

  async checkKakaoUser(accessToken : string , loginWithKakaoDto : LoginWithKakaoDto){
    const url = 'https://kapi.kakao.com/v2/user/me';   
    
    try {
      const response = await firstValueFrom(
        this.httpService.get<KakaoUserInfoDto>(url, {
          headers: {
            Authorization: accessToken,
          },
        })
      );
  
      // 이 부분에서 KakaoTokenInfoDto 타입으로 response.data를 반환합니다.
      const data : KakaoUserInfoDto = response.data;

      if(loginWithKakaoDto.uid != data.id.toString()){
        throw new HttpException('로그인 정보가 일치하지 않습니다.',HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const errorCode = error.response.data.code;  // API 응답에서 에러 코드를 추출
        switch (errorCode) {
          case -1:
            console.error('Temporary internal failure in Kakao platform:', error);
            throw new HttpException('Temporary internal failure. Please try again later.', HttpStatus.BAD_REQUEST);
          case -2:
            console.error('Invalid request parameters:', error);
            throw new HttpException('Invalid request parameters. Check your data types and values.', HttpStatus.BAD_REQUEST);
          case -401:
            console.error('Invalid or expired token:', error);
            throw new HttpException('Invalid or expired token. Please refresh your token and try again.', HttpStatus.UNAUTHORIZED);
          default:
            console.error('Error fetching access token info:', error);
            throw new HttpException('Failed to fetch access token info', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        console.error('Unexpected error fetching access token info:', error);
        throw new HttpException('Unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async createUserByKakao(loginWithKakaoDto : LoginWithKakaoDto ,  userType: 'common' | 'admin' = 'common') : Promise<string>{
   
    try {
      const uid = `kakao:${loginWithKakaoDto.uid}`;

      const updateParams = {
        displayName: loginWithKakaoDto.displayName,
        provider: "kakao",
        birth: "2000-10-22",
        gender: "male",
      };

      try {
        await admin.auth().updateUser(uid, updateParams);
        console.log(`카카오 로그인 : ${loginWithKakaoDto.uid} , ${loginWithKakaoDto.displayName}`)
      } catch (e) {
        updateParams['uid'] = uid;
        await admin.auth().createUser(updateParams);
        console.log(`카카오 회원가입 : ${loginWithKakaoDto.uid} , ${loginWithKakaoDto.displayName}`)
      }

      const userDocRef = admin.firestore().collection('users').doc(uid);
      await userDocRef.set({
        uid: uid,
        displayName: loginWithKakaoDto.displayName,
        userType: userType,
        provider: "kakao",
        birth: "2000-10-22",
        gender: "male",
      }, { merge: true });  

      const token = await admin.auth().createCustomToken(uid);

      return token;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const errorCode = error.response.data.code;  // API 응답에서 에러 코드를 추출
        switch (errorCode) {
          case -1:
            console.error('Temporary internal failure in Kakao platform:', error);
            throw new HttpException('Temporary internal failure. Please try again later.', HttpStatus.BAD_REQUEST);
          case -2:
            console.error('Invalid request parameters:', error);
            throw new HttpException('Invalid request parameters. Check your data types and values.', HttpStatus.BAD_REQUEST);
          case -401:
            console.error('Invalid or expired token:', error);
            throw new HttpException('Invalid or expired token. Please refresh your token and try again.', HttpStatus.UNAUTHORIZED);
          default:
            console.error('Error fetching access token info:', error);
            throw new HttpException('Failed to fetch access token info', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        console.error('Unexpected error fetching access token info:', error);
        throw new HttpException('Unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
  }

  async getUserInfo(accessToken : string , loginWithKakaoDto : LoginWithKakaoDto) : Promise<string>{
    const url = 'https://kapi.kakao.com/v2/user/me';   
    
    try {
      const response = await firstValueFrom(
        this.httpService.get<KakaoUserInfoDto>(url, {
          headers: {
            Authorization: accessToken,
          },
        })
      );
  
      // 이 부분에서 KakaoTokenInfoDto 타입으로 response.data를 반환합니다.
      const data : KakaoUserInfoDto = response.data;


      if(loginWithKakaoDto.uid != data.id.toString()){
        throw new HttpException('로그인 정보가 일치하지 않습니다.',HttpStatus.BAD_REQUEST);
      }
      else{
        const uid = `kakao:${loginWithKakaoDto.uid}`;

        const updateParams = {
          displayName: loginWithKakaoDto.displayName,
        };

        try {
          await admin.auth().updateUser(uid, updateParams);
          console.log(`카카오 로그인 : ${loginWithKakaoDto.uid} , ${loginWithKakaoDto.displayName}`)
        } catch (e) {
          updateParams['uid'] = uid;
          await admin.auth().createUser(updateParams);
          console.log(`카카오 회원가입 : ${loginWithKakaoDto.uid} , ${loginWithKakaoDto.displayName}`)
        }

        const token = await admin.auth().createCustomToken(uid);

        return token;
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const errorCode = error.response.data.code;  // API 응답에서 에러 코드를 추출
        switch (errorCode) {
          case -1:
            console.error('Temporary internal failure in Kakao platform:', error);
            throw new HttpException('Temporary internal failure. Please try again later.', HttpStatus.BAD_REQUEST);
          case -2:
            console.error('Invalid request parameters:', error);
            throw new HttpException('Invalid request parameters. Check your data types and values.', HttpStatus.BAD_REQUEST);
          case -401:
            console.error('Invalid or expired token:', error);
            throw new HttpException('Invalid or expired token. Please refresh your token and try again.', HttpStatus.UNAUTHORIZED);
          default:
            console.error('Error fetching access token info:', error);
            throw new HttpException('Failed to fetch access token info', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        console.error('Unexpected error fetching access token info:', error);
        throw new HttpException('Unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
  }

  async loginWithNaver(accessToken : string , loginWithKakaoDto : LoginWithKakaoDto){

    await this.checkNaverAccessToken(accessToken);

    const uid = `naver:${loginWithKakaoDto.uid}`;

    const updateParams = {
      displayName: loginWithKakaoDto.displayName,
    };

    try {
      await admin.auth().updateUser(uid, updateParams);
      console.log(`네이버 로그인 : ${loginWithKakaoDto.uid} , ${loginWithKakaoDto.displayName}`)
    } catch (e) {
      updateParams['uid'] = uid;
      await admin.auth().createUser(updateParams);
      console.log(`네이버 회원가입 : ${loginWithKakaoDto.uid} , ${loginWithKakaoDto.displayName}`)
    }

    const token = await admin.auth().createCustomToken(uid);

    return token;    
  }

  async checkNaverAccessToken(accessToken : string){
    try {

      console.log(accessToken);

      const response = await firstValueFrom(
        this.httpService.get<KakaoUserInfoDto>('https://openapi.naver.com/v1/nid/me', {
          headers: {
            Authorization: accessToken,
          },
        })
      );

      console.log(response.data);

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const errorCode = error.response.data.code;  // API 응답에서 에러 코드를 추출
        switch (errorCode) {
          case -1:
            console.error('Temporary internal failure in Kakao platform:', error);
            throw new HttpException('Temporary internal failure. Please try again later.', HttpStatus.BAD_REQUEST);
          case -2:
            console.error('Invalid request parameters:', error);
            throw new HttpException('Invalid request parameters. Check your data types and values.', HttpStatus.BAD_REQUEST);
          case -401:
            console.error('Invalid or expired token:', error);
            throw new HttpException('Invalid or expired token. Please refresh your token and try again.', HttpStatus.UNAUTHORIZED);
          default:
            console.error('Error fetching access token info:', error);
            throw new HttpException('Failed to fetch access token info', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        console.error('Unexpected error fetching access token info:', error);
        throw new HttpException('Unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

}
