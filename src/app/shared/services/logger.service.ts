import { Injectable } from '@angular/core';

/**
 * @author Dominik Dorfstetter (dorfstetter@posteo.de)
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  /*  log level info
  ==================*/
  public logInfo(message: string): void {
    console.log(this.getCurrentTimeAsString() + ' [INFO] - ' + message);
  }

  /*  log level warn
    ================*/
  public logWarn(message: string): void {
    console.log(this.getCurrentTimeAsString() + ' [WARN] - ' + message);
  }

  /*  log level error
    =================*/
  public logError(message: string): void {
    console.error(this.getCurrentTimeAsString() +  ' [ERROR] - ' + message);
  }

  /*  log level debug --> just console
    ================================*/
  public logDebug(message: string): void {
    console.debug(this.getCurrentTimeAsString() +  ' [DEBUG] - ' + message);
  }

  /*  get current time as locale string
    ===================================*/
  private getCurrentTimeAsString = () => {
    return new Date().toLocaleDateString();  
  }
}
