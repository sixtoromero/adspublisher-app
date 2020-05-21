import { PositionModel } from './position.model';

export class MarkerModel {
  public position: PositionModel;
  public title: string;
  public descripcion: string;
  public icon: string = 'assets/images/marker.png';
}