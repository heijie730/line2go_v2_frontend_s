import {CodeTypeEnum} from "./VerificationCodeVo";

export class SignupVo {
  email: string
  password: string
  confirmPassword: string;
  username: string;
  // phone: string;
  verificationCode: string;
  codeType:CodeTypeEnum;
}
