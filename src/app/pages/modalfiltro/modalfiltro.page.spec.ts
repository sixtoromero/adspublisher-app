import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalfiltroPage } from './modalfiltro.page';

describe('ModalfiltroPage', () => {
  let component: ModalfiltroPage;
  let fixture: ComponentFixture<ModalfiltroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalfiltroPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalfiltroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
