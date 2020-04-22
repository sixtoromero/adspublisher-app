import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlanesPage } from './planes.page';

describe('PlanesPage', () => {
  let component: PlanesPage;
  let fixture: ComponentFixture<PlanesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
