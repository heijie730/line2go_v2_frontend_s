import {Result} from "./Result";
import {UserRole} from "./UserVo";

export class JwtResponse extends Result {
  accessToken: string;
  refreshToken: string;
  id:string;
  username: string;
  email: string;
  // openId: string;
  // phone: string;
  registerDate: Date;
  registrationMethod:string;
  userRole:UserRole;
  // subscriptionType:string;
  // subscriptionStartDateTime:string;
  // subscriptionEndDateTime:string;
  jwtResponseList:JwtResponse[];

}
