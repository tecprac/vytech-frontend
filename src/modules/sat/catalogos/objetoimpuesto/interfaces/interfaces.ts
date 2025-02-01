export interface SatObjetoImpuesto {
    id: number;
    c_objetoimp: string;
    descripcion: string;
    ini_vigencia: Date | null;
    fin_vigencia: Date | null;
    activo: boolean;
}