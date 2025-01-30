<script setup lang="ts">
import { useRouter,useRoute } from 'vue-router';
import { watch, ref } from 'vue';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useCliente from '../composables/useCliente';
import type {Cliente} from '../interfaces/interfaces';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth';
import InputMask from 'primevue/inputmask';
import Message from 'primevue/message';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Checkbox from 'primevue/checkbox';
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from 'primevue/confirmdialog';


export interface Permisos {
    modulo: string,
    permiso: string,
}

const router = useRouter();
const route  = useRoute();
const auth   = useAuthStore();
const confirm   = useConfirm();

const permisos = ref<Permisos[]>([]);
const sPermisos = ref<string>('');
permisos.value = auth.permisos.filter((element: any) => element.codigo == '040'); // Modulo Admimistración Usuarios
permisos.value.forEach(element => {
     sPermisos.value += element.permiso+',';
});

const {
    registro,
    isPending,
    isError,
    isDeleting,
    isDeletingSuccess,
    dataMutationDelete,
    selectedestado,
    estadosfiltrados,
    tabActiva,
    tipospersona,
    paises,
    selectpais,
    municipios,
    ciudades,
    colonias,
    regimenesfiscal,
    formaspago,
    metodospago,
    usoscfdi,
    selectregimenfiscal,
    selectformapago,
    selectmetodopago,
    selectusocfdi,
    condicionescredito,
    regimenesfiscal_filtrado,
    usoscfdi_filtrado,

    deleteRegistro
} = useCliente( +route.params.id );


watch(isError, () => {
    if(isError.value)
        router.replace('/clientes')
})

const Eliminar = (data: Cliente) => {
    confirm.require({
        header: 'Estas seguro de eliminar el registro ?',
        message: 'Esta acción no se podra revertir!',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancelar',
        rejectProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Si, Eliminar',
            severity: 'danger'
        },
        accept: () => {
            deleteRegistro(data!);
        }
    });
}
</script>

<template>
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Consulta Cliente</h2>
    </div>
    <div v-if="registro">
        <form @submit.prevent="Eliminar(registro!)">
            <div class="card-body border-0 pt-0 pb-0">
                <div class="row mb-2">
                    <label for="id" class="col-form-label col-form-label-sm col-sm-2">ID</label>
                    <div class="col-sm-2">
                        <InputNumber id="id" v-model="registro.id" maxlength="120" disabled fluid size="small"
                            :pt="{ pcInputText: { root:{ class: 'text-end'}} }">
                        </InputNumber>
                    </div>
                    <label for="tipo_persona" class="col-form-label col-form-label-sm col-sm-2">Tipo Persona</label>
                    <div class="col-sm-2">
                        <InputText v-model="registro.tipo_persona" size="small" fluid disabled>
                        </InputText>
                    </div>
                </div>
                <div v-if="registro.tipo_persona!='Moral'" class="row mb-2">
                    <div class="col-sm-4 fv-row">
                        <label for="nombres" class="required form-label fw-semibold">
                            Nombres
                        </label>
                        <InputText id="nombres" v-model="registro.nombres" size="small" fluid disabled>
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="apaterno" class="required form-label fw-semibold">
                            Apellido Paterno
                        </label>
                        <InputText id="apaterno" 
                            v-model="registro.apaterno" size="small" disabled fluid>
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="amaterno" class="required form-label fw-semibold">
                            Apellido Materno
                        </label>
                        <InputText id="amaterno" v-model="registro.amaterno" size="small" disabled fluid>
                        </InputText>
                    </div>
                </div>
                <div v-if="registro.tipo_persona=='Moral'" class="row mb-2">
                    <div class="col-sm-12 fv-row">
                        <label for="razonsocial" class="required form-label fw-semibold">
                            Razón Social
                        </label>
                        <InputText id="razonsocial" v-model="registro.razon_social" size="small" disabled fluid>
                        </InputText>
                    </div>
                </div>
                <div class="row mb-5">
                    <div class="col-sm-6 fv-row">
                        <label for="rfc" class="required form-label fw-semibold">
                            RFC:
                        </label>
                        <InputText v-model="registro.rfc" fluid size="small" disabled>
                        </InputText>
                    </div>
                    <div class="col-sm-6 fv-row">
                        <label for="curp" class="form-label fw-semibold">
                            CURP:
                        </label>
                        <InputText id="curp" v-model="registro.curp" size="small" disabled fluid>
                        </InputText>
                    </div>
                </div>
                <Tabs value="0" @update:value="(value: string | number) => { tabActiva = value.toString()}">
                    <TabList>
                        <Tab value="0" as="div" class="flex items-center gap-2"
                            :pt="{root: { class: tabActiva == '0' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}"
                        >
                        <i class="pi pi-home" style="color: slateblue"></i>
                            Generales
                        </Tab>
                        <Tab value="1" as="div" class="flex items-center gap-2"
                            :pt="{root: { class: tabActiva == '1' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}"
                        >
                        <i class="pi pi-building-columns" style="color: slateblue"></i>
                            CFDI / Impuestos
                        </Tab>
                        <Tab value="2" as="div" class="flex items-center gap-2"
                            :pt="{root: { class: tabActiva == '2' ? 'bg-primary bg-opacity-25' : 'bg-secondary'}}"
                        >
                        <i class="pi pi-dollar" style="color: slateblue"></i>
                            Crédito
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <!-- Generales -->
                        <TabPanel value="0">
                            <Accordion :value="['0','1']" multiple>
                                <AccordionPanel value="0" >
                                    <AccordionHeader class="bg-secondary">Dirección</AccordionHeader>
                                    <AccordionContent>
                                        <div class="row mb-2">
                                            <div class="col-sm-4 fv-row">
                                                <label for="pais" class="required form-label fw-semibold">
                                                    País
                                                </label>
                                                <Select
                                                    v-model="selectpais" 
                                                    :options="paises" fluid
                                                    option-label="descripcion" 
                                                    filter size="small" disabled>
                                                </Select>
                                            </div>
                                            <div class="col-sm-2 fv-row">
                                                <label for="cp" class="required form-label fw-semibold">
                                                    C.P:
                                                </label>
                                                <InputText v-model="registro.cp" fluid size="small" disabled>
                                                </InputText>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-sm-4 fv-row">
                                                <label for="estado" class="required form-label fw-semibold">
                                                    Estado
                                                </label>
                                                <InputText v-model="registro.estado" fluid size="small" disabled>
                                                </InputText>
                                            </div>
                                            <div class="col-sm-4 fv-row">
                                                <label for="municipio" class="form-label fw-semibold">
                                                    Municipio
                                                </label>
                                                <InputText v-model="registro.municipio" fluid size="small" disabled>
                                                </InputText>
                                            </div>
                                            <div class="col-sm-4 fv-row">
                                                <label for="ciudad" class="form-label fw-semibold">
                                                    Ciudad
                                                </label>
                                                <InputText v-model="registro.ciudad" fluid size="small" disabled>
                                                </InputText>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-sm-6 fv-row">
                                                <label for="colonia" class="form-label fw-semibold">
                                                    Colonia
                                                </label>
                                                <InputText v-model="registro.colonia" fluid size="small" disabled>
                                                </InputText>
                                            </div>
                                            <div class="col-sm-6 fv-row">
                                                <label for="calle" class="form-label fw-semibold">
                                                    Calle y Numero
                                                </label>
                                                <InputText v-model="registro.calle" size="small" fluid disabled>
                                                </InputText>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionPanel>
                                <AccordionPanel value="1">
                                    <AccordionHeader class="bg-secondary">Contacto</AccordionHeader>
                                    <AccordionContent>
                                        <div class="row mb-2">
                                            <div class="col-sm-6 fv-row">
                                                <label for="telefono_fijo" class="form-label fw-semibold">
                                                    Telefono Oficina
                                                </label>
                                                <InputMask v-model="registro.telefono_fijo" mask="(999) 999 9999" fluid size="small"
                                                    :unmask="true" placeholder="(999) 999 9999" disabled >
                                                </InputMask>
                                            </div>
                                            <div class="col-sm-6 fv-row">
                                                <label for="telefono_movil" class="form-label fw-semibold">
                                                    Telefono Movil
                                                </label>
                                                <InputMask v-model="registro.telefono_movil" mask="(999) 999 9999" fluid size="small"
                                                    :unmask="true" placeholder="(999) 999 9999" disabled >
                                                </InputMask>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-sm-6 fv-row">
                                                <label for="email" class="form-label fw-semibold">
                                                    Email
                                                </label>
                                                <InputText
                                                    v-model="registro.email"
                                                    size="small" fluid disabled >
                                                </InputText>
                                            </div>
                                            <div class="col-sm-6 fv-row">
                                                <label for="email_adicional" class="form-label fw-semibold">
                                                    Email para enviar documentos CFDI
                                                    <i class="pi pi-info-circle" 
                                                        style="font-size: 1rem;"
                                                        v-tooltip.top="'A este correo se enviaran los CFDI (Facturas, Pagos, Notas de Crédito, etc )'" />
                                                </label>
                                                <InputText
                                                    v-model="registro.email_adicional"
                                                    size="small" fluid disabled >
                                                </InputText>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-sm-6 fv-row">
                                                <label for="replega" class="form-label fw-semibold">
                                                    Representante Legal o Nombre del Contacto
                                                </label>
                                                <InputText
                                                    v-model="registro.rep_legal"
                                                    size="small" fluid disabled >
                                                </InputText>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionPanel>
                            </Accordion>
                        </TabPanel>
                        <!-- CFDI / Impuestos -->
                         <TabPanel value="1">
                            <Accordion :value="['0','1']" multiple>
                                <AccordionPanel value="0" >
                                    <AccordionHeader class="bg-secondary">Anexo 20 CFDI</AccordionHeader>
                                    <AccordionContent>
                                        <div class="row mt-2 mb-2">
                                            <label for="RegimenFiscal" class="required col-form-label col-form-label-sm col-sm-2">
                                                Régimen Fiscal
                                            </label>
                                            <div class="col-sm-4">
                                                <InputText
                                                    v-if="registro.sat_regimenfiscal"
                                                    :value="registro.sat_regimenfiscal.c_regimenfiscal+' '+registro.sat_regimenfiscal.regimenfiscal"
                                                    size="small" fluid disabled >
                                                </InputText>
                                            </div>
                                            <label for="addenda" class="col-form-label col-form-label-sm col-sm-3">
                                                Tiene Addenda
                                            </label>
                                            <div class="col-sm-2">
                                                <Checkbox
                                                    v-model="registro.tiene_addenda" binary
                                                    input-id="addenda" fluid disabled
                                                ></Checkbox>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <label for="formapago" class="required col-form-label col-form-label-sm col-sm-2">
                                                Forma de Pago
                                            </label>
                                            <div class="col-sm-4">
                                                <InputText
                                                    v-if="registro.sat_formapago"
                                                    :value="registro.sat_formapago.c_formapago+' '+registro.sat_formapago.formapago"
                                                    size="small" fluid disabled >
                                                </InputText>
                                            </div>
                                            <label for="complementocp" class="col-form-label col-form-label-sm col-sm-3">
                                                Complemento Carta Porte
                                            </label>
                                            <div class="col-sm-2">
                                                <Checkbox
                                                    v-model="registro.carta_porte" binary
                                                    input-id="complementocp" fluid disabled
                                                ></Checkbox>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <label for="metodopago" class="required col-form-label col-form-label-sm col-sm-2">
                                                Metodo Pago
                                            </label>
                                            <div class="col-sm-4">
                                                <InputText
                                                    v-if="registro.sat_metodopago"
                                                    :value="registro.sat_metodopago.c_metodopago+' '+registro.sat_metodopago.metodopago"
                                                    size="small" fluid disabled >
                                                </InputText>
                                            </div>
                                            <label for="enviarfactura" class="col-form-label col-form-label-sm col-sm-3">
                                                Enviar Factura por correo
                                                <i class="pi pi-info-circle" 
                                                    style="font-size: 1rem;"
                                                    v-tooltip.top="'Al activar esta opción, despues de timbrar el CFDI, será enviando al receptor automaticamente'" />
                                            </label>
                                            <div class="col-sm-2">
                                                <Checkbox
                                                    v-model="registro.enviar_factura" binary
                                                    input-id="enviarfactura" fluid disabled
                                                ></Checkbox>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <label for="usocfdi" class="required col-form-label col-form-label-sm col-sm-2">
                                                Uso de CFDI
                                            </label>
                                            <div class="col-sm-4">
                                                <InputText
                                                    v-if="registro.sat_usocfdi"
                                                    :value="registro.sat_usocfdi.c_usocfdi+' '+registro.sat_usocfdi.usocfdi"
                                                    size="small" fluid disabled >
                                                </InputText>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionPanel>
                                <AccordionPanel value="1" >
                                    <AccordionHeader class="bg-secondary">Impuestos</AccordionHeader>
                                    <AccordionContent>
                                        <div class="row mt-2 mb-2">
                                            <label for="iva" class="col-form-label col-form-label-sm col-sm-2">
                                                I.V.A %
                                            </label>
                                            <div class="col-sm-2">
                                                <InputNumber
                                                    v-model="registro.impuesto_iva"
                                                    :min-fraction-digits="2"
                                                    :max-fraction-digits="2"
                                                    :max="100.00"
                                                    :min="0.00"
                                                    fluid size="small" disabled
                                                    :pt="{ pcInputText: { root:{ class: 'text-end'}} }"
                                                >
                                                </InputNumber>
                                            </div>
                                            <label for="ieps" class="col-form-label col-form-label-sm col-sm-2">
                                                I.E.P.S %
                                            </label>
                                            <div class="col-sm-2">
                                                <InputNumber
                                                    v-model="registro.impuesto_iesps"
                                                    :max="100.00"
                                                    :min="0.00"
                                                    :min-fraction-digits="2"
                                                    :max-fraction-digits="2"
                                                    fluid size="small" disabled
                                                    :pt="{ pcInputText: { root:{ class: 'text-end'}} }"
                                                >
                                                </InputNumber>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <label for="retiva" class="col-form-label col-form-label-sm col-sm-2">
                                                Retención I.V.A %
                                            </label>
                                            <div class="col-sm-2">
                                                <InputNumber
                                                    v-model="registro.retencion_iva"
                                                    :max="100.00"
                                                    :min="0.00"
                                                    :min-fraction-digits="2"
                                                    :max-fraction-digits="2"
                                                    fluid size="small" disabled
                                                    :pt="{ pcInputText: { root:{ class: 'text-end'}} }"
                                                >
                                                </InputNumber>
                                            </div>
                                            <label for="retieps" class="col-form-label col-form-label-sm col-sm-2">
                                                Retención I.E.P.S %
                                            </label>
                                            <div class="col-sm-2">
                                                <InputNumber
                                                    v-model="registro.retencion_isr"
                                                    :max="100.00"
                                                    :min="0.00"
                                                    :min-fraction-digits="2"
                                                    :max-fraction-digits="2"
                                                    fluid size="small" disabled
                                                    :pt="{ pcInputText: { root:{ class: 'text-end'}} }"
                                                >
                                                </InputNumber>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <label for="desieps" class="col-form-label col-form-label-sm col-sm-2">
                                                Desglosar IEPS en CFD
                                            </label>
                                            <div class="col-sm-2">
                                                <Checkbox
                                                    v-model="registro.desglosariespsencfdi" binary
                                                    input-id="desieps" fluid disabled
                                                ></Checkbox>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionPanel>
                            </Accordion>
                         </TabPanel>
                        <!-- Crédito -->
                        <TabPanel value="2">
                            <div class="row mb-2">
                                <label for="condiciones" class="col-form-label col-form-label-sm col-sm-2 fw-semibold">
                                    Condiciones
                                </label>
                                <div class="col-sm-2">
                                    <Select
                                        v-model="registro.condiciones"
                                        :options="condicionescredito"
                                        size="small" fluid disabled
                                    >
                                    </Select>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <label for="limite" class="col-form-label col-form-label-sm col-sm-2 fw-semibold">
                                    Limite Crédito
                                </label>
                                <div class="col-sm-2">
                                    <InputNumber
                                        v-model="registro.limite_credito"
                                        :min-fraction-digits="2"
                                        :max-fraction-digits="2"
                                        :max="9999999.99"
                                        :min="0.00"
                                        mode="currency"
                                        locale="en-US"
                                        currency="USD"
                                        fluid size="small" disabled
                                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }"
                                    >
                                    </InputNumber>
                                </div>
                                <label for="dias" class="col-form-label col-form-label-sm col-sm-2 fw-semibold">
                                    Dias Crédito
                                </label>
                                <div class="col-sm-1">
                                    <InputNumber
                                        v-model="registro.dias_credito"
                                        :max="9999"
                                        :min="0"
                                        fluid size="small" disabled
                                        :pt="{ pcInputText: { root:{ class: 'text-end'}} }"
                                    >
                                    </InputNumber>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <label for="comentarios" class="col-form-label col-form-label-sm col-sm-2 fw-semibold">
                                    Comentarios
                                </label>
                                <div class="col-sm-10">
                                    <Textarea
                                    v-model="registro.observaciones"
                                    rows="6" fluid disabled>
                                    </Textarea>
                                </div>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
            <div class="card-footer">
                <Button
                    severity="secondary" label="Regresar"
                    class="me-4" raised icon="pi pi-arrow-left"
                    @click="() => { router.push({name: 'clientes'})}">
                </Button>
                <Button 
                    v-if="sPermisos.indexOf('Eliminar') >= 0 "
                    label="Eliminar" type="submit"
                    severity="danger" icon="pi pi-times" raised
                    v-tooltip.top="{ value: 'Eliminar', showDelay: 1000, hideDelay: 300}"
                >
                </Button>
            </div>
        </form>
    </div>
    <Toast/>
    <ConfirmDialog :pt="{ header: { class: 'bg-secondary mb-2'} }" />
</template>

<style scoped>

</style>