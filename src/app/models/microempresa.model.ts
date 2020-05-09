import { SubCategoriaModel } from './subcategoria.model';

export class MicroEmpresaModel {
    public IDMicroEmpresa: number;
    public IDCliente: number;
    public Nombre: string;
    public Descripcion: string;
    public Fax: string;
    public Telefono: string;
    public Celular: string;
    public Direccion: string;
    public Longitud: string;
    public Latitud: string;
    public FechaCreacion: Date;
    public Estado: boolean;
    public IDCategoria: number;
    public IDPlan: number;

    public SubCategorias: [];

}