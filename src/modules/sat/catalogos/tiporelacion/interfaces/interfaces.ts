export interface SatTipoRelacion {
    id:             number;
	c_tiporelacion: string;
	descripcion:    string;
	ini_vigencia:   Date | null;
	fin_vigencia:   Date | null;
	activo:         boolean;
}