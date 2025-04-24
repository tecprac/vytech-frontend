import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
// import { Tooltip } from "bootstrap";
import { VueQueryPlugin } from "@tanstack/vue-query";
import App from "./App.vue";

/*
TIP: To get started with clean router change path to @/router/clean.ts.
 */
import router from "./router/clean";
import ElementPlus from "element-plus";
import i18n from "@/core/plugins/i18n";

//imports for app initialization
import ApiService from "@/core/services/ApiService";
import { initApexCharts } from "@/core/plugins/apexcharts";
import { initInlineSvg } from "@/core/plugins/inline-svg";
import { initVeeValidate } from "@/core/plugins/vee-validate";
import { initKtIcon } from "@/core/plugins/keenthemes";

// PrimeVue
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import { definePreset } from '@primevue/themes';
// import Aura from '@primevue/themes/aura';
import Aura from '@primeuix/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice';

import 'primeicons/primeicons.css'

import "@/core/plugins/prismjs";

import "@/core/plugins/yup";

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.use(ElementPlus);

ApiService.init(app);
initApexCharts(app);
initInlineSvg(app);
initKtIcon(app);
initVeeValidate();

VueQueryPlugin.install( app, {
    queryClientConfig: {
        defaultOptions: {
            queries: {
                gcTime: 1000 * 60, // 1 Minuto
            }
        }
    },
    enableDevtoolsV6Plugin: true
});

app.use(i18n);


// PrimeVue Servicios y Configuración
const MyPreset = definePreset(Aura,{
    semantic: {
        primary: {
            50:  '{red.50}',
            100: '{red.100}',
            200: '{red.200}',
            300: '{red.300}',
            400: '{red.400}',
            500: '{red.500}',
            600: '{red.600}',
            700: '{red.700}',
            800: '{red.800}',
            900: '{red.900}',
            950: '{red.950}'
        },
    },
    components: {
        button: {
            colorScheme: {
                light: {
                    // @ts-ignore
                    warn: {
                        background: '{yellow.400}',
                        border: { color: '{yellow.400}'},
                        hover: {
                            background: '{yellow.300}',
                            border: { color: '{yellow.300}' }
                        },
                    },
                    info: {
                        background: '{blue.400}',
                        border: { color: '{blue.400}'},
                        hover: {
                            background: '{blue.300}',
                            border: { color: '{blue.300}' }
                        },
                    },
                },
                dark: {
                    // @ts-ignore
                    warn: {
                        background: '{yellow.600}',
                        border: { color: '{yellow.600}'},
                        hover: {
                            background: '{yellow.500}',
                            border: { color: '{yellow.500}' }
                        },
                    },
                    info: {
                        background: '{blue.600}',
                        border: { color: '{blue.600}'},
                        hover: {
                            background: '{blue.500}',
                            border: { color: '{blue.500}' }
                        },
                    },
                },
            },
        }
    }
});
app.use(PrimeVue, {
    ripple: true,
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: '.app-dark',
        }
    },
    zIndex: {
        modal: 1050,        //dialog, sidebar Original 3100
        overlay: 1000,      //dropdown, overlaypanel Original 3000
        menu: 1000,         //overlay menus
        tooltip: 1100       //tooltip
    },
    locale: {
        startsWith: "Comience con",
        contains: "Contenga",
        notContains: "No contenga",
        endsWith: "Termine con",
        equals: "Igual a",
        notEquals: "Diferente a",
        noFilter: "Sin filtro",
        lt: "Menor que",
        lte: "Menor o igual a",
        gt: "Mayor que",
        gte: "Mayor o igual a",
        dateIs: "Fecha igual a",
        dateIsNot: "Fecha diferente a",
        dateBefore: "Fecha antes de",
        dateAfter: "Fecha después de",
        custom: "Personalizar",
        clear: "Limpiar",
        apply: "Aplicar",
        matchAll: "Coincidir todo",
        matchAny: "Coincidir con cualquiera",
        addRule: "Agregar regla",
        removeRule: "Eliminar regla",
        accept: "Sí",
        reject: "No",
        choose: "Escoger",
        upload: "Subir",
        cancel: "Cancelar",
        dayNames: [
            "Domingo",
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado"
        ],
        dayNamesShort: [
            "Dom",
            "Lun",
            "Mar",
            "Mié",
            "Jue",
            "Vie",
            "Sáb"
        ],
        dayNamesMin: [
            "D",
            "L",
            "M",
            "X",
            "J",
            "V",
            "S"
        ],
        monthNames: [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        ],
        monthNamesShort: [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dic"
        ],
        today: "Hoy",
        weekHeader: "Sem",
        firstDayOfWeek: 1,
        showMonthAfterYear: false,
        dateFormat: "dd/mm/yy",
        weak: "Débil",
        medium: "Medio",
        strong: "Fuerte",
        passwordPrompt: "Escriba una contraseña",
        emptyFilterMessage: "Sin opciones disponibles",
        emptyMessage: "No se han encontrado resultados",
        aria: {
            trueLabel: "Verdadero",
            falseLabel: "Falso",
            nullLabel: "No seleccionado",
            star: "1 estrella",
            stars: "{star} estrellas",
            selectAll: "Seleccionar todos",
            unselectAll: "Deseleccionar todos",
            close: "Cerrar",
            previous: "Anterior",
            next: "Siguiente",
            navigation: "Navegación",
            scrollTop: "Desplazarse arriba",
            moveTop: "Mover arriba",
            moveUp: "Subir",
            moveDown: "Bajar",
            moveBottom: "Desplazarse abajo",
            moveToTarget: "Mover al objectivo",
            moveToSource: "Mover al fuente",
            moveAllToTarget: "Mover todo al objetivo",
            moveAllToSource: "Mover todo al fuente",
            pageLabel: "{page}",
            firstPageLabel: "Primera Página",
            lastPageLabel: "Última Página",
            nextPageLabel: "Siguiente Página",
            previousPageLabel: "Página Anterior",
            rowsPerPageLabel: "Filas por página",
            jumpToPageDropdownLabel: "Ir al menú desplegable de página",
            jumpToPageInputLabel: "Ir a la entrada de página",
            selectRow: "Seleccionar fila",
            unselectRow: "Desmarcar fila",
            expandRow: "Expandir Fila",
            collapseRow: "Reducir Fila",
            showFilterMenu: "Mostrar menú del filtro",
            hideFilterMenu: "Ocultar menú del filtro",
            filterOperator: "Operador de filtro",
            filterConstraint: "Restricción de filtro",
            editRow: "Editar fila",
            saveEdit: "Guardar editado",
            cancelEdit: "Cancelar editado",
            listView: "Vista de lista",
            gridView: "Vista de cuadrícula",
            slide: "Deslizar",
            slideNumber: "{slideNumber}",
            zoomImage: "Ampliar imagen",
            zoomIn: "Ampliar",
            zoomOut: "Reducir",
            rotateRight: "Girar derecha",
            rotateLeft: "Girar izquierda"
         }
    }
});
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);

// app.directive("tooltip", (el) => {
//   new Tooltip(el);
// });

app.directive("tooltip", Tooltip);

app.mount("#app");
