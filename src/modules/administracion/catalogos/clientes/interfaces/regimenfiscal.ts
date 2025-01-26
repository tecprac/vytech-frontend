export interface RegimenFiscal {
    id: number;
    c_regimenfiscal: string;
    descripcion: string;
    fisica: string;
    moral: string;
    ini_vigencia: Date | null;
    fin_vigencia: Date | null;
    activo?: boolean;
}