export class HistorialPagosModel {
    public IDHistorialPago: number;
    public IDFactura: number;
    public Valor_Pago: number;
    public FechaCreacion: Date;
    public FechaCulminacion: Date;
    public Estado: boolean;

    public IDPlan: number;
    public Titulo: string;
    public Descripcion: string;
    public Precio: number;
    public NroMeses: number;
}