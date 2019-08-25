import {
  Injectable
} from '@angular/core';
import { LoggerService } from './logger.service';

/*  interface for firebase error helper
    ==================================*/
export interface FirebaseErrorServiceInterface {
  readonly dictionary: Array <string> ;
  getTranslation(errorcode: string): string;
}

/*  google firebase error codes
    ==========================*/
export const APP_DELETED = 'auth/app-deleted';
export const APP_NOT_AUTHORIZED = 'auth/app-not-authorized';
export const ARGUMENT_ERROR = 'auth/argument-error';
export const INVALID_API_KEY = 'auth/invalid-api-key';
export const INVALID_USER_TOKEN = 'auth/invalid-user-token';
export const NETWORK_REQ_FAILED = 'auth/network-request-failed';
export const OPERATION_NOT_ALLOWED = 'auth/operation-not-allowed';
export const REQUIRES_RECENT_LOGIN = 'auth/requires-recent-login';
export const TOO_MANY_REQUESTS = 'auth/too-many-requests';
export const UNAUTHORIZED_DOMAIN = 'auth/unauthorized-domain';
export const USER_DISABLED = 'auth/user-disabled';
export const USER_TOKEN_EXP = 'auth/user-token-expired';
export const WEB_STORAGE_UNSUPP = 'auth/web-storage-unsupported';
export const INVALID_EMAIL = 'auth/invalid-email';
export const USER_NOT_FOUND = 'auth/user-not-found';
export const WRONG_PASSWORD = 'auth/wrong-password';
export const EMAIL_IN_USE = 'auth/email-already-in-use';
export const WEAK_PASSWORD = 'auth/weak-password';

/**
 * @author Dominik Dorfstetter (dorfstetter@posteo.de)
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseErrorService implements FirebaseErrorServiceInterface {
  readonly dictionary: Array <string> = [];

  constructor(private logS: LoggerService) {
    this.setGermanTranslation();
  }

  /*  sets our translation array
    ============================*/
  private setGermanTranslation (): void {
    this.dictionary[APP_DELETED]            = 'Netzwerkfehler, bitte versuche es später erneut.';
    this.dictionary[APP_NOT_AUTHORIZED]     = 'Netzwerkfehler, bitte versuche es später erneut.';
    this.dictionary[ARGUMENT_ERROR]         = 'Netzwerkfehler, bitte versuche es später erneut.';
    this.dictionary[INVALID_API_KEY]        = 'Netzwerkfehler, bitte versuche es später erneut.';
    this.dictionary[WEB_STORAGE_UNSUPP]     = 'Netzwerkfehler, bitte versuche es später erneut.';
    this.dictionary[NETWORK_REQ_FAILED]     = 'Netzwerkfehler, bitte versuche es später erneut.';
    this.dictionary[UNAUTHORIZED_DOMAIN]    = 'Netzwerkfehler, bitte versuche es später erneut.';
    this.dictionary[INVALID_USER_TOKEN]     = 'Sitzungs-Fehler, bitte versuche es später erneut.';
    this.dictionary[OPERATION_NOT_ALLOWED]  = 'Vorgang nicht möglich.';
    this.dictionary[TOO_MANY_REQUESTS]      = 'Zu viele Anmeldeversuche, bitte versuche es später erneut.';
    this.dictionary[REQUIRES_RECENT_LOGIN]  = 'Bitte melde sich erneut an um fortzufahren!';
    this.dictionary[USER_DISABLED]          = 'Ihr Account wurde deaktivert. Bitte wende sich an den Support.';
    this.dictionary[USER_TOKEN_EXP]         = 'Sitzung abgelaufen, bitte melde sich erneut an!';
    this.dictionary[INVALID_EMAIL]          = 'Bitte überprüfe das Format deiner E-Mail Adresse!';
    this.dictionary[USER_NOT_FOUND]         = 'Username oder Passwort falsch!';
    this.dictionary[WRONG_PASSWORD]         = 'Username oder Passwort falsch!';
    this.dictionary[EMAIL_IN_USE]           = 'Diese E-Mail Adresse wird bereits verwendet!';
    this.dictionary[WEAK_PASSWORD]          = 'Bitte verwende ein stärkeres Passwort!';
  };

  /*  expects a firebase error code, returns translation
  ======================================================*/
  public getTranslation (errorcode: string): string {
    this.logS.logDebug(errorcode);
    return this.dictionary[errorcode] ? this.dictionary[errorcode] : 'Keine Übersetzung gefunden!';
  };
}
