import {
  TestBed,
  ComponentFixture
} from '@angular/core/testing';
import {
  UserService
} from './user.service';
import {
  AngularFireAuthModule,
  AngularFireAuth
} from '@angular/fire/auth';
import {
  AngularFirestoreModule,
  AngularFirestore
} from '@angular/fire/firestore';
import {
  SnackbarService
} from './snackbar.service';
import {
  LoggerService
} from './logger.service';
import {
  MatSnackBarModule
} from '@angular/material';
import {
  AngularFireModule
} from '@angular/fire';
import {
  environment
} from 'src/environments/environment';
import {
  Observable,
  of
} from 'rxjs';

let loggerSpy: jasmine.SpyObj < LoggerService > ;
let snackbarSpy: jasmine.SpyObj < SnackbarService > ;
let angularfireAuthSpy: jasmine.SpyObj<AngularFireAuth>;
let angularfirestoreSpy: jasmine.SpyObj<AngularFirestore>;


const AngularFireAuthMock = {
  auth: {

  },
  authState: of ({})
};

const AngularFirestoreMock = {
  doc: of ({})
};

describe('UserService', () => {
  let component: UserService;
  let fixture: ComponentFixture < UserService > ;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj < LoggerService > ('LoggerService', ['logInfo']);
    snackbarSpy = jasmine.createSpyObj < SnackbarService > ('SnackbarService', ['showSnackBar']);
    angularfireAuthSpy = jasmine.createSpyObj<AngularFireAuth>('AngularFireAuth', ['auth', 'authState', 'user']);
    angularfirestoreSpy = jasmine.createSpyObj<AngularFirestore>('AngularFirestore', ['doc']);

    TestBed.configureTestingModule({
      imports: [AngularFireModule, 
                MatSnackBarModule, 
                AngularFirestoreModule, 
                AngularFireAuthModule, 
                AngularFireModule.initializeApp(environment.firebase)],
      providers: [UserService, {
        provide: AngularFireAuth,
        useValue: angularfireAuthSpy
      }, {
        provide: AngularFirestore,
        useValue: angularfirestoreSpy
      }, {
        provide: SnackbarService,
        useValue: snackbarSpy
      }, {
        provide: LoggerService,
        useValue: loggerSpy
      }]
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserService);
    component = fixture.componentInstance;
  });

  fit('should be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });
});
