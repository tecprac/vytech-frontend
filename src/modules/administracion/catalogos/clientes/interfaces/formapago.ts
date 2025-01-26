export interface FormaPago {
    id: number;
    c_formapago: string;
    descripcion: string;
    bancarizado: string;
    numerooperacion: string;
    rfccuentaordenante: string;
    cuentaordenante: string;
    patronctaordenante: string;
    rfccuentabeneficiario: string;
    cuentabeneficiario: string;
    patronctabeneficiario: string;
    tipocadenapago: string;
    bancoemisor: string;
    ini_vigencia: Date | null;
    fin_vigencia: Date | null;
    activo: boolean;
}