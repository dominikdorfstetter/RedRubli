import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  /*  log level info and push to IONIC PRO
  ====================================*/
  public logInfo(message: string): void {
    console.log(this.getCurrentTimeAsString() + ' [INFO] - ' + message);
  }

  /*  log level warn and push to IONIC PRO
    ==================================*/
  public logWarn(message: string): void {
    console.log(this.getCurrentTimeAsString() + ' [WARN] - ' + message);
  }

  /*  log level error and push to IONIC PRO
    =====================================*/
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
