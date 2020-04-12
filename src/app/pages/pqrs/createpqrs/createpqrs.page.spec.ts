import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreatepqrsPage } from './createpqrs.page';

describe('CreatepqrsPage', () => {
  let component: CreatepqrsPage;
  let fixture: ComponentFixture<CreatepqrsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatepqrsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatepqrsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
