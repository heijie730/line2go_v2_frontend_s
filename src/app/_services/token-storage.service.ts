import {Injectable} from '@angular/core';
import {JwtResponse} from "../models/JwtResponse";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const REFRESH_TOKEN_KEY = 'auth-refresh-token';
const TOKEN_KEY_LIST = 'auth-token-list';
const GUEST_USER_KEY = 'guest-auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() {
  }

  removeAccessToken() {
    window.localStorage.removeItem(TOKEN_KEY);
  }

  signOut(): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(TOKEN_KEY_LIST);

    // window.localStorage.clear();
    // this.socialAuthService.signOut();
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(jwtResponse: JwtResponse): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(jwtResponse));
  }

  public getUser(): JwtResponse |null{
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  public saveGuestUser(jwtResponse: JwtResponse): void {
    window.localStorage.removeItem(GUEST_USER_KEY);
    window.localStorage.setItem(GUEST_USER_KEY, JSON.stringify(jwtResponse));
  }

  public getGuestUser(): JwtResponse | null {
    const user = window.localStorage.getItem(GUEST_USER_KEY);
    if (user) {
      return JSON.parse(user);
    } else {
      return null;
    }
  }

  public saveRefreshToken(token: string): void {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public saveSessionInfo(jwtResponse: JwtResponse) {
    this.saveToken(jwtResponse.accessToken);
    this.saveRefreshToken(jwtResponse.refreshToken);
    this.saveUser(jwtResponse);
  }


  public saveSessionInfoList(jwtResponses: JwtResponse[]) {
    window.localStorage.removeItem(TOKEN_KEY_LIST);
    window.localStorage.setItem(TOKEN_KEY_LIST, JSON.stringify(jwtResponses));
  }
  public removeSessionInfoList(){
    window.localStorage.removeItem(TOKEN_KEY_LIST);
  }

  public getSessionInfoList(): JwtResponse[] {
    const tokenList = window.localStorage.getItem(TOKEN_KEY_LIST);
    if (tokenList) {
      return JSON.parse(tokenList);
    }
    return [];
  }
}
