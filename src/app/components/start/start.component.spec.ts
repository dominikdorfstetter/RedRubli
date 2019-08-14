import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartComponent } from './start.component';
import { LoginComponent } from 'src/app/shared/components/login/login.component';
import { MatCardModule, MatFormFieldModule } from '@angular/material';
import { FormGroup } from '@angular/forms';

describe('StartComponent', () => {
  let component: StartComponent;
  let fixture: ComponentFixture<StartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatCardModule, MatFormFieldModule ],
      declarations: [ StartComponent, LoginComponent, FormGroup ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
