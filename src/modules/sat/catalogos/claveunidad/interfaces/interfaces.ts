export interface SatClaveUnidad {
    id: number;
    c_claveunidad: string;
    nombre: string;
    ini_vigencia: Date | null;
    fin_vigencia: Date | null;
    activo: boolean;
}