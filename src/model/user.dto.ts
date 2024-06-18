import { Gender } from "src/common/enum/gender.enum";
import { SocialProvider } from "src/common/enum/social-provider.enum";

export class UserDto{
    socialProvider : SocialProvider;
    uid : string;
    displayName : string;
    birth : string;
    gender : Gender
}