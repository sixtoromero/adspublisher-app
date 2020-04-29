import { GeneralModel } from './general.model';

export class PlanModel {
    public IDPlan: number;
    public Titulo: string;
    public Descripcion: string;
    public Precio: number;
    public Detalle: string;
    public FechaCreacion: Date;
    public Estado: boolean;
    public NroMeses: number;

    public ADetalle: GeneralModel[];
    public Seleccionado: boolean;
}
