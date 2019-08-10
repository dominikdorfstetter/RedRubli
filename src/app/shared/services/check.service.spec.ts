import {
  TestBed
} from '@angular/core/testing';
import {
  CheckService
} from './check.service';

describe('CheckService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckService = TestBed.get(CheckService);
    expect(service).toBeTruthy();
  });

  it('should test different zipcode', () => {
    const service: CheckService = TestBed.get(CheckService);
    const zipFourDigits: string = '1120';
    const zipFiveDigits: string = '12333';
    const wrongZip: string = 'asdf123';

    expect(service.checkZipCode(zipFourDigits, 4)).toBeTruthy();
    expect(service.checkZipCode(zipFiveDigits, 5)).toBeTruthy();
    expect(service.checkZipCode(wrongZip, 4)).toBeFalsy();
  });

  it('should test length of strings', () => {
    const service: CheckService = TestBed.get(CheckService);
    const goodString: string = 'AABBCC123';
    const shortString: string = 'AA';
    const longString: string = 'AABBCC123AA'

    expect(service.checkString(goodString, 3, 9)).toBeTruthy();
    expect(service.checkString(shortString, 3, 9)).toBeFalsy();
    expect(service.checkString(longString, 3, 9)).toBeFalsy();
  });

  fit('should test if an email is valid', () => {
    const service: CheckService = TestBed.get(CheckService);
    const goodMail: string[] = [
      'test@test.at',
      'test@test.co.at'
    ];
    const badMail: string[] = [
      'test@test',
      'test'
    ];

    goodMail.forEach(mail => {
      expect(service.checkEmail(mail)).toBeTruthy();
    });

    badMail.forEach(mail => {
      expect(service.checkEmail(mail)).toBeFalsy();
    });
  });
});
