export interface SatClaveProdServ {
    id: number;
    c_claveprodserv: string;
    descripcion: string;
    ini_vigencia: Date | null;
    fin_vigencia: Date | null;
    activo: boolean;
}