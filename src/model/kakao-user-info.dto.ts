import { KakaoAccountDto, KakaoForPartnerDto, KakaoPropertiesDto } from "./kakao-profile.dto";

export class KakaoUserInfoDto {
    id: number;
    connected_at: string;
    kakao_account: KakaoAccountDto;
    properties: KakaoPropertiesDto;
    for_partner: KakaoForPartnerDto;
}