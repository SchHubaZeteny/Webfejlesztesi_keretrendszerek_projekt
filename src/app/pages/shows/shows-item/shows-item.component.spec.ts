import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowsItemComponent } from './shows-item.component';

describe('ShowsItemComponent', () => {
  let component: ShowsItemComponent;
  let fixture: ComponentFixture<ShowsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowsItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
