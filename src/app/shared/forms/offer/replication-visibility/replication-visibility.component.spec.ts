import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplicationVisibilityComponent } from './replication-visibility.component';

describe('ReplicationVisibilityComponent', () => {
  let component: ReplicationVisibilityComponent;
  let fixture: ComponentFixture<ReplicationVisibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplicationVisibilityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReplicationVisibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
