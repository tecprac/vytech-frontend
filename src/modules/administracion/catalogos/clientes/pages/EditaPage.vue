<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { watch } from 'vue';
import LoadingModal from '@/shared/components/LoadingModal.vue';    
import useCliente from '../composables/useCliente';
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
import { useForm } from 'vee-validate';
import * as yup from 'yup';

interface Errores {
    [campo: string]: string;
}

const router = useRouter();
const route  = useRoute();
const toast  = useToast();
const auth   = useAuthStore();

const {
    registro,
    isPending,
    isError,
    isUpdating,
    isUpdatingSuccess,
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
    serrores,

    dataMutationUpdate,
    updateRegistro,
    buscarEstados,
    buscarCP,
    cambiaTipoPersona,
    cambiaPais,
} = useCliente( +route.params.id );

const schema = yup.object({
    tipo_persona:   yup.string().required().min(1).label('Tipo de Persona'),
    rfc:            yup.string().required().min(12).max(13).label('RFC'),
    cp:             yup.string().required().min(5).max(5).label('Código Postal'),
});

const { 
    defineField,
    handleSubmit,
    resetForm,
    errors,
} = useForm({ validationSchema: schema, initialValues: {
    tipo_persona:   registro.value.tipo_persona,
    rfc:            registro.value.rfc,
    cp:             registro.value.cp
} });

const [tipo_persona]    = defineField('tipo_persona');
const [rfc]             = defineField('rfc');
const [cp]              = defineField('cp');

const onSuccess = async (values) => {
    serrores.value = '';
    if (values.tipo_persona == 'Moral') {
        registro.value.nombres = '';
        registro.value.apaterno = '';
        registro.value.amaterno = '';
        if (!registro.value.razon_social) serrores.value += 'Razón Social, Este campo es requerido\n';
    } else {
        registro.value.razon_social = '';
        if (!registro.value.nombres) serrores.value     += 'Nombres, Este campo es requerido\n';
        if (!registro.value.apaterno) serrores.value    += 'Apellido Paterno, Este campo es requerido\n';
        if (!registro.value.amaterno) serrores.value    += 'Apellido Materno, Este campo es requerido\n';
    }
    if (registro.value.regimenfiscal_id == 0) serrores.value += 'Régimen Fiscal, Este campo es requerido\n';
    if (registro.value.formapago_id == 0) serrores.value += 'Forma Pago, Este campo es requerido\n';
    if (registro.value.metodopago_id == 0) serrores.value += 'Método Pago, Este campo es requerido\n';
    if (registro.value.usocfdi_id == 0) serrores.value += 'Uso de CFDI, Este campo es requerido\n';
    if (serrores.value.length > 0) {
        toast.add({
            severity:   'warn',
            summary:    'Información Faltante',
            detail:     serrores,
            life:       5000
        });
        return;
    }
    registro.value.tipo_persona = values.tipo_persona;
    registro.value.cp           = values.cp;
    registro.value.rfc          = values.rfc;
    registro.value.pais_id      = selectpais.value!.id;
    registro.value.estado_id    = selectedestado.value.id;
    registro.value.estado       = selectedestado.value.descripcion;
    updateRegistro(registro.value);
    serrores.value = '';
}

const onInvalidSubmit = ({values, errors, results}) => {
    serrores.value = '';
    const terrores:Errores = errors;
    for(const campo in terrores){
        serrores.value += `${campo.toUpperCase()}, ${terrores[campo]}\n`;
    }
    if (tipo_persona.value == 'Fisica'){
        if (!registro.value.nombres) serrores.value     += 'Nombres, Este campo es requerido\n';
        if (!registro.value.apaterno) serrores.value    += 'Apellido Paterno, Este campo es requerido\n';
        if (!registro.value.amaterno) serrores.value    += 'Apellido Materno, Este campo es requerido\n';
    }
    if (tipo_persona.value == 'Moral'){
        if (!registro.value.razon_social) serrores.value += 'Razón Social, Este campo es requerido\n';
    }
    if (registro.value.regimenfiscal_id == 0) serrores.value += 'Régimen Fiscal, Este campo es requerido\n';
    if (registro.value.formapago_id == 0) serrores.value    += 'Forma Pago, Este campo es requerido\n';
    if (registro.value.metodopago_id == 0) serrores.value   += 'Método Pago, Este campo es requerido\n';
    if (registro.value.usocfdi_id == 0) serrores.value      += 'Uso de CFDI, Este campo es requerido\n';
    toast.add({
        severity:   'warn',
        summary:    'Información Faltante',
        detail:     serrores,
        life:       5000
    });
};

const onSubmit = handleSubmit(onSuccess,onInvalidSubmit);

watch(registro, () => {
    if(registro.value.id > 0) {
        resetForm({
            values: {
                tipo_persona:   registro.value.tipo_persona,
                rfc:            registro.value.rfc,
                cp:             registro.value.cp
            }
        });
    }
},{deep: true} )

watch( isUpdatingSuccess, () => {
    setTimeout(() => {
        dataMutationUpdate.reset();
    }, 2000);
    resetForm();
});

watch(isError, () => {
    if(isError.value)
        router.replace('/clientes')
});

</script>

<template> 
    <LoadingModal v-if="isPending" />
    <div class="card-header border-0 pt-2">
        <h2>Editar Cliente</h2>
    </div>
    <div v-if="registro">
        <form @submit="onSubmit">
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
                        <Select v-model="tipo_persona" :options="tipospersona" size="small" fluid
                            @change="cambiaTipoPersona(tipo_persona)" disabled>
                        </Select>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-sm-4 fv-row">
                        <label for="nombres" class="required form-label fw-semibold">
                            Nombres
                        </label>
                        <InputText id="nombres" 
                            v-model="registro.nombres" size="small"
                            :disabled="tipo_persona=='Moral'" fluid>
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="apaterno" class="required form-label fw-semibold">
                            Apellido Paterno
                        </label>
                        <InputText id="apaterno" 
                            v-model="registro.apaterno" size="small"
                            :disabled="tipo_persona=='Moral'" fluid>
                        </InputText>
                    </div>
                    <div class="col-sm-4 fv-row">
                        <label for="amaterno" class="required form-label fw-semibold">
                            Apellido Materno
                        </label>
                        <InputText id="amaterno" 
                            v-model="registro.amaterno" size="small"
                            :disabled="tipo_persona=='Moral'" fluid>
                        </InputText>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-sm-12 fv-row">
                        <label for="razonsocial" class="required form-label fw-semibold">
                            Razón Social
                        </label>
                        <InputText id="razonsocial" 
                            v-model="registro.razon_social" size="small"
                            :disabled="tipo_persona=='Fisica'" fluid>
                        </InputText>
                    </div>
                </div>
                <div class="row mb-5">
                    <div class="col-sm-6 fv-row">
                        <label for="rfc" class="required form-label fw-semibold">
                            RFC:
                        </label>
                        <InputMask v-model="rfc" :mask="tipo_persona=='Fisica' ? 'aaaa-999999-***': 'aaa-999999-***'"
                            fluid :unmask="true" size="small">
                        </InputMask>
                        <Message v-if="errors.rfc" severity="error" variant="simple" size="small">{{ errors.rfc }}</Message>
                    </div>
                    <div class="col-sm-6 fv-row">
                        <label for="curp" class="form-label fw-semibold">
                            CURP:
                        </label>
                        <InputText id="curp" 
                            v-model="registro.curp" size="small"
                            :disabled="tipo_persona=='Moral'" fluid>
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
                                                    filter size="small"
                                                    @change="cambiaPais"
                                                >
                                                </Select>
                                            </div>
                                            <div class="col-sm-2 fv-row">
                                                <label for="cp" class="required form-label fw-semibold">
                                                    C.P:
                                                </label>
                                                <InputMask v-model="cp" mask="99999" fluid size="small"
                                                    :unmask="true" placeholder="00000"
                                                    @keypress="(event:Event) => { buscarCP(cp,event) }"
                                                    @blur="buscarCP(cp)"
                                                >
                                                </InputMask>
                                                <Message v-if="errors.cp" severity="error" variant="simple" size="small">{{ errors.cp }}</Message>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-sm-4 fv-row">
                                                <label for="estado" class="required form-label fw-semibold">
                                                    Estado
                                                </label>
                                                <Select
                                                    v-model="selectedestado"
                                                    option-label="descripcion"
                                                    :options="estadosfiltrados"
                                                    :editable="estadosfiltrados.length == 0"
                                                    :placeholder="estadosfiltrados.length == 0 ? 'Capture un Estado' : 'Seleccione un estado'"
                                                    fluid size="small"
                                                >
                                                </Select>
                                            </div>
                                            <div class="col-sm-4 fv-row">
                                                <label for="municipio" class="form-label fw-semibold">
                                                    Municipio
                                                </label>
                                                <Select
                                                    v-model="registro.municipio"
                                                    fluid size="small"
                                                    :options="municipios"
                                                    :editable="true"
                                                    placeholder="Seleccione o Capture un Municipio"
                                                >
                                                </Select>
                                            </div>
                                            <div class="col-sm-4 fv-row">
                                                <label for="ciudad" class="form-label fw-semibold">
                                                    Ciudad
                                                </label>
                                                <Select
                                                    v-model="registro.ciudad"
                                                    fluid size="small"
                                                    :options="ciudades"
                                                    :editable="true"
                                                    placeholder="Seleccione o Capture una Ciudad"
                                                >
                                                </Select>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <div class="col-sm-6 fv-row">
                                                <label for="colonia" class="form-label fw-semibold">
                                                    Colonia
                                                </label>
                                                <Select
                                                    v-model="registro.colonia"
                                                    fluid size="small"
                                                    :options="colonias"
                                                    :editable="true"
                                                    placeholder="Seleccione o Capture una Colonia"
                                                >
                                                </Select>                                                
                                            </div>
                                            <div class="col-sm-6 fv-row">
                                                <label for="calle" class="form-label fw-semibold">
                                                    Calle y Numero
                                                </label>
                                                <InputText v-model="registro.calle" size="small" fluid>
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
                                                    :unmask="true" placeholder="(999) 999 9999"
                                                >
                                                </InputMask>
                                            </div>
                                            <div class="col-sm-6 fv-row">
                                                <label for="telefono_movil" class="form-label fw-semibold">
                                                    Telefono Movil
                                                </label>
                                                <InputMask v-model="registro.telefono_movil" mask="(999) 999 9999" fluid size="small"
                                                    :unmask="true" placeholder="(999) 999 9999"
                                                >
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
                                                    size="small" fluid
                                                >
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
                                                    size="small" fluid
                                                >
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
                                                    size="small" fluid
                                                    :disabled="registro.tipo_persona == 'Física'"
                                                >
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
                                                <Select
                                                    v-model="registro.regimenfiscal_id"
                                                    fluid size="small"
                                                    :options="regimenesfiscal_filtrado"
                                                    option-value="id"
                                                    :option-label="(data) => data.c_regimenfiscal+' '+data.descripcion"
                                                    placeholder="Seleccione un Régimen Fiscal"
                                                >
                                                </Select>                                                
                                            </div>
                                            <label for="addenda" class="col-form-label col-form-label-sm col-sm-3">
                                                Tiene Addenda
                                            </label>
                                            <div class="col-sm-2">
                                                <Checkbox
                                                    v-model="registro.tiene_addenda" binary
                                                    input-id="addenda" fluid
                                                ></Checkbox>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <label for="formapago" class="required col-form-label col-form-label-sm col-sm-2">
                                                Forma de Pago
                                            </label>
                                            <div class="col-sm-4">
                                                <Select
                                                    v-model="registro.formapago_id"
                                                    fluid size="small"
                                                    :options="formaspago"
                                                    option-value="id"
                                                    :option-label="(data) => data.c_formapago+' '+data.descripcion"
                                                    placeholder="Seleccione una Forma de Pago"
                                                >
                                                </Select>                                                
                                            </div>
                                            <label for="complementocp" class="col-form-label col-form-label-sm col-sm-3">
                                                Complemento Carta Porte
                                            </label>
                                            <div class="col-sm-2">
                                                <Checkbox
                                                    v-model="registro.carta_porte" binary
                                                    input-id="complementocp" fluid
                                                ></Checkbox>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <label for="metodopago" class="required col-form-label col-form-label-sm col-sm-2">
                                                Metodo Pago
                                            </label>
                                            <div class="col-sm-4">
                                                <Select
                                                    v-model="registro.metodopago_id"
                                                    fluid size="small"
                                                    :options="metodospago"
                                                    option-value="id"
                                                    :option-label="(data) => data.c_metodopago+' '+data.descripcion"
                                                    placeholder="Seleccione un Metodo de Pago"
                                                >
                                                </Select>                                                
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
                                                    input-id="enviarfactura" fluid
                                                ></Checkbox>
                                            </div>
                                        </div>
                                        <div class="row mb-2">
                                            <label for="usocfdi" class="required col-form-label col-form-label-sm col-sm-2">
                                                Uso de CFDI
                                            </label>
                                            <div class="col-sm-4">
                                                <Select
                                                    v-model="registro.usocfdi_id"
                                                    fluid size="small"
                                                    :options="usoscfdi_filtrado"
                                                    option-value="id"
                                                    :option-label="(data) => data.c_usocfdi+' '+data.descripcion"
                                                    placeholder="Seleccione un Uso del CFDI"
                                                >
                                                </Select>                                                
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
                                                    fluid size="small"
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
                                                    fluid size="small"
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
                                                    fluid size="small"
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
                                                    fluid size="small"
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
                                                    input-id="desieps" fluid
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
                                        size="small"
                                        fluid
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
                                        fluid size="small"
                                        :disabled="registro.condiciones == 'Contado'"
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
                                        fluid size="small"
                                        :disabled="registro.condiciones == 'Contado'"
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
                                    rows="6" fluid>
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
                    severity="success" label="Guardar" type="submit"
                    class="me-4" raised icon="pi pi-check" :loading="isUpdating"
                >
                </Button>
            </div>
        </form>
    </div>
    <Toast />
</template>