import { Component, OnInit } from '@angular/core';
import { FilterModel } from '../../../models/filter.model';
import { GeneralService } from 'src/app/services/general.service';
import { CategoriaModel } from 'src/app/models/categoria.mode';
import { SubCategoriaModel } from 'src/app/models/subcategoria.model';
import { CategoriasService } from 'src/app/services/categorias/categorias.service';
import { SubCategoriasService } from 'src/app/services/subcategorias/subcategorias.service';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { MicroEmpresaService } from 'src/app/services/MicroEmpresas/microempresas.service';
import { FilterService } from 'src/app/services/MicroEmpresas/filter.service';
import { MicroEmpresaModel } from '../../../models/microempresa.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {


  liCategorias = new Array<CategoriaModel>();
  liSubCategorias = new Array<SubCategoriaModel>();
  liMicroEmpresas = new Array<MicroEmpresaModel>();

  ifilter = new FilterModel();

  constructor(private service: FilterService,
              public gservice: GeneralService,
              private cservice: CategoriasService,
              private sservice: SubCategoriasService,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private loadinCtrl: LoadingController) { }

  async ngOnInit() {
    this.getCategorias();
  }

  async getCategorias() {

    let loading = this.loadinCtrl.create({
      message: 'Cargando Categorías'
    });
    (await loading).present();

    let token = await this.gservice.getStorage('token');

    const result = await this.cservice.GetCategorias(token);
    this.liCategorias = result as CategoriaModel[];
    
    (await loading).dismiss();

    if (result == null) {
      this.showAlert('No se cargaron los registros de Categorías, intente nuevamente');
    }

  }

  async getSubCategorias(ID: number) {

    let token = await this.gservice.getStorage('token');

    let loading = this.loadinCtrl.create({
      message: 'Cargando Subcategorías'
    });
    (await loading).present();

    const result = await this.sservice.GetSubCategorias(token, ID);

    //console.log('SubCategorias', result);

    (await loading).dismiss();

    if (result == null) {
      this.showAlert('No se cargaron las subcategorias, intente nuevamente');
    } else {
      this.liSubCategorias = result as SubCategoriaModel[];
      console.log('SubCategorías', this.liSubCategorias);
    }
  }

  async showAlert(message: string) {

    const alert = await this.alertCtrl.create({
      header: 'ADS Publisher',
      message,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  close() {    
    this.modalCtrl.dismiss({
      ModalProcess: false,
      Message: ''
    });
  }  

  async getfilter() {

    let loading = this.loadinCtrl.create({
      message: 'espere un momento por favor.'
    });
    (await loading).present();

    let _token = await this.gservice.getStorage('token');

    const result = await this.service.getFilter(this.ifilter, _token);
    this.liMicroEmpresas = result as MicroEmpresaModel[];

    (await loading).dismiss();

    if (result == null) {
      this.showAlert('No se cargaron los filtros, intente nuevamente');
    } else {
      this.modalCtrl.dismiss({
        ModalProcess: true,
        GetMicroEmpresa: this.liMicroEmpresas
      });
    }
  }

}
