import { createI18n } from "vue-i18n";

const messages = {
  en: {
    account: "Account",
    accountOverview: "Overview",
    activity: "Activity",
    addSubscription: "Add Subscription",
    administration: "Administration",
    apps: "Apps",
    authentication: "Authentication",
    basicFlow: "Basic Flow",
    calendarApp: "Calendar",
    campaigns: "Campaigns",
    catalogs: "Catalogs",
    changelog: "Changelog",
    chat: "Chat",
    components: "Components",
    connections: "Connections",
    craft: "Crafted",
    createAccount: "Create Account",
    createAPIKey: "Create API Key",
    createApp: "Create App",
    customerDetails: "Customers Details",
    customers: "Customers",
    customersListing: "Customers Listing",
    dashboard: "Dashboard",
    docsAndComponents: "Docs & Components",
    documentation: "Documentation",
    documents: "Documents",
    drawerChat: "Drawer Chat",
    error404: "Error 404",
    error500: "Error 500",
    exampleLink: "Example link",
    forms: "Forms",
    general: "General",
    getStarted: "Getting Started",
    gettingStarted: "Getting Started",
    groupChat: "Group Chat",
    horizontal: "Horizontal",
    inviteFriends: "Invite Friends",
    layoutBuilder: "Layout builder",
    mainmenu:'Main Menu',
    megaMenu: "Mega Menu",
    modals: "Modals",
    modules: "Modules",
    multiStepSignUp: "Multi-steps Sign up",
    newAddress: "New Address",
    newCard: "New Card",
    newTarget: "New Target",
    pages: "Pages",
    passwordReset: "Password Reset",
    privateChat: "Private Chat",
    profile: "Profile",
    profileOverview: "Overview",
    projects: "Projects",
    reports: "Reports",
    resources: "Resources",
    settings: "Settings",
    shareAndEarn: "Share & Earn",
    signIn: "Sign-in",
    signUp: "Sign-up",
    store: "Store",
    subscriptionList: "Subscription List",
    subscriptions: "Subscriptions",
    twoFactorAuth: "Two Factor Auth",
    upgradePlan: "Upgrade Plan",
    vertical: "Vertical",
    viewSubscription: "View Subscription",
    viewUsers: "View Users",
    widgets: "Widgets",
    widgetsCharts: "Charts",
    widgetsFeeds: "Feeds",
    widgetsLists: "Lists",
    widgetsMixed: "Mixed",
    widgetsStatistics: "Statistics",
    widgetsTables: "Tables",
    wizards: "Wizards",
    workshop: 'Workshop'
  },
  es: {
    account: "Cuenta",
    accountOverview: "Descripción general",
    activity: "Actividad",
    addSubscription: "Añadir Suscripción",
    administration: "Administración",
    apps: "Aplicaciones",
    authentication: "Autenticación",
    basicFlow: "Flujo básico",
    calendarApp: "Calendario",
    campaigns: "Campañas",
    catalogs: "Catalogos",
    changelog: "Registro de cambios",
    chat: "Chat",
    components: "Componentes",
    connections: "Conexiones",
    craft: "Elaborado",
    createAccount: "Crear Una Cuenta",
    createAPIKey: "Crea Clave De Api",
    createApp: "Crear Aplicacion",
    customerDetails: "Detalles De Los Clientes",
    customers: "Clientes",
    customersListing: "Listado De Clientes",
    dashboard: "Principal",
    docsAndComponents: "Documentos & Componentes",
    documentation: "Documentación",
    documents: "Documentos",
    drawerChat: "Chat del cajón",
    error404: "Error 404",
    error500: "Error 500",
    exampleLink: "Enlace de ejemplo",
    forms: "Formas",
    general: "General",
    getStarted: "Empezando",
    gettingStarted: "Empezando",
    groupChat: "Grupo de chat",
    horizontal: "Horizontal",
    inviteFriends: "Invitar A Amigos",
    layoutBuilder: "Constructor de maquetación",
    mainmenu:'Menú Principal',
    megaMenu: "Mega menú",
    modals: "Modales",
    modules: "Modulos",
    multiStepSignUp: "Regístrese Multi-Pasos",
    newAddress: "Nueva Direccion",
    newCard: "Nueva Tarjeta",
    newTarget: "Nuevo Objetivo",
    pages: "Paginas",
    passwordReset: "Restablecimiento de contraseña",
    privateChat: "Chat privado",
    profile: "Perfil",
    profileOverview: "Descripción general",
    projects: "Proyectos",
    reports: "Reportes",
    resources: "Recursos",
    settings: "Configuración",
    shareAndEarn: "Compartir Y Ganar",
    signIn: "Registrarse",
    signUp: "Inscribirse",
    store: "Almacén",
    subscriptionList: "Lista De Suscripción",
    subscriptions: "Suscripciones",
    twoFactorAuth: "Dos Factores",
    upgradePlan: "Plan De Actualización",
    vertical: "Vertical",
    viewSubscription: "Suscripción",
    viewUsers: "Ver Usuarios",
    widgets: "Widgets",
    widgetsCharts: "Gráficos",
    widgetsFeeds: "Alimenta",
    widgetsLists: "Liza",
    widgetsMixed: "Mezclada",
    widgetsStatistics: "Estadísticas",
    widgetsTables: "Mesas",
    wizards: "Magos",
    workshop: 'Taller'
  },
};

const i18n = createI18n({
  legacy: false,
  locale: "en",
  globalInjection: true,
  messages,
});

export default i18n;
