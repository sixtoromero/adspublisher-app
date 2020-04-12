import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListpqrsPage } from './listpqrs.page';

describe('ListpqrsPage', () => {
  let component: ListpqrsPage;
  let fixture: ComponentFixture<ListpqrsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListpqrsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListpqrsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
