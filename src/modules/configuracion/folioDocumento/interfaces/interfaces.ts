export interface FolioDocumento {
    id:             number;
    modulo_id:      number;
    documento:      string;
    folio_siguiente: number;
    serie:          string;
    activo:         boolean;
    conf_modulo?:   conf_modulo;
}

interface conf_modulo {
    modulo:     string,
    subseccion: string,
    seccion:    string,
}