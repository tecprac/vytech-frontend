export interface OrdenTrabajoBitacora {
    id:                 number;
    usuario_id:         number;
    orden_trabajo_id:   number;
    tecnico_id:         number;
    fecha_inicio:       Date;
    fecha_fin?:         Date | null;
    comentarios:        string;
    estatus:            string;
}