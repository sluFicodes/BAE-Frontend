import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationProfileDrawerComponent } from './configuration-profile-drawer.component';

describe('ConfigurationProfileDrawerComponent', () => {
  let component: ConfigurationProfileDrawerComponent;
  let fixture: ComponentFixture<ConfigurationProfileDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationProfileDrawerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigurationProfileDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
