export interface UsoCFDI {
    id:             number;
    c_usocfdi:      string;
    descripcion:    string;
    fisica:         string;
    moral:          string;
    regimen_receptor: string;
    ini_vigencia:   Date | null;
    fin_vigencia:   Date | null;
    activo:        boolean;
}