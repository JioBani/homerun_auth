// src/kakao/dto/kakao-profile.dto.ts

export class KakaoProfileDto {
    nickname: string;
    thumbnail_image_url: string;
    profile_image_url: string;
    is_default_image: boolean;
    is_default_nickname: boolean;
}

// src/kakao/dto/kakao-account.dto.ts

export class KakaoAccountDto {
    profile_nickname_needs_agreement: boolean;
    profile_image_needs_agreement: boolean;
    profile: KakaoProfileDto;
    name_needs_agreement: boolean;
    name: string;
    email_needs_agreement: boolean;
    is_email_valid: boolean;
    is_email_verified: boolean;
    email: string;
    age_range_needs_agreement: boolean;
    age_range: string;
    birthyear_needs_agreement: boolean;
    birthyear: string;
    birthday_needs_agreement: boolean;
    birthday: string;
    birthday_type: string;
    gender_needs_agreement: boolean;
    gender: string;
    phone_number_needs_agreement: boolean;
    phone_number: string;
    ci_needs_agreement: boolean;
    ci: string;
    ci_authenticated_at: string;
}

// src/kakao/dto/kakao-properties.dto.ts
export class KakaoPropertiesDto {
    [key: string]: string;  // 동적 프로퍼티들을 위한 인덱스 시그니처
}

// src/kakao/dto/kakao-for-partner.dto.ts
export class KakaoForPartnerDto {
    uuid: string;
}

// src/kakao/dto/kakao-token-response.dto.ts

export class KakaoTokenResponseDto {
    id: number;
    connected_at: string;
    kakao_account: KakaoAccountDto;
    properties: KakaoPropertiesDto;
    for_partner: KakaoForPartnerDto;
}