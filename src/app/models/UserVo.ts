import {Result} from "./Result";
import {Type} from "class-transformer";
import {Tag} from "./QueueVo";

export class UserVo extends Result {
  id:string;
  name: string;
  // phone:string;
  // openId:string;
  // mpOpenId:string;
  registrationMethod:string;
  userRole:UserRole;

  // fcmToken: string|null;
  @Type(() => Map)
  fcmTokenMap:Map<string, FcmToken>;
  // bgNotify: boolean;
  fgNotify: boolean;
  emailNotify: boolean;
  userId: string;
  email: string;
  password: string;
  emailVerified: boolean;
  issuer: string;
  picture: string;
  userVos:UserVo[];
  fcmToken:FcmToken;
}
export class FcmToken{
  enable:boolean;
  token:string;
  deviceName:string;
  fingerprint:string;
  createDateTime:Date;
}
export enum UserRole{
  GUEST="GUEST",
  USER="USER",
  ADMIN="ADMIN",
  SUPER_ADMIN="SUPER_ADMIN"
}
