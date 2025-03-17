import { formatInTimeZone } from 'date-fns-tz';

const useUtilerias = () => {

    const convertTMZdatetime = (fecha: string) => {
        const timezone:string = import.meta.env.VITE_APP_TIME_ZONE;
        try {
            return formatInTimeZone(fecha,timezone,'dd-MM-yyyy HH:mm');    
        } catch (error) {
            return formatInTimeZone(new Date(),timezone,'dd-MM-yyyy HH:mm');    
        }
    }

    const convertTMZtime = (fecha: string) => {
        const timezone:string = import.meta.env.VITE_APP_TIME_ZONE;
        try {
            return formatInTimeZone(fecha,timezone,'HH:mm');    
        } catch (error) {
            return formatInTimeZone(new Date(),timezone,'HH:mm');    
        }
    }

    const convertTMZdate = (fecha: string) => {
        const timezone:string = import.meta.env.VITE_APP_TIME_ZONE;
        try {
            return formatInTimeZone(fecha,timezone,'dd-MM-yyyy');
        } catch (error) {
            return formatInTimeZone(new Date(),timezone,'dd-MM-yyyy');
        }
    }

    const formatNumber = (value: number) => {
        if (value) {
            return typeof(value) == 'string' ? 
                    parseFloat(value).toLocaleString('es-MX') :
                    value.toLocaleString('es-MX') ;
        } else {
            return '0';
        }
    }

    const formatNumber2Dec = (value: number) => {
        if (value) {
            return typeof(value) == 'string' ? 
                    parseFloat(value).toLocaleString('es-MX',{
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }) :
                    value.toLocaleString('es-MX') ;
        } else {
            return '0';
        }
    }

    const formatCurrency = (value: number ) => {
        if (value) {
            return typeof(value) == 'string' ? 
                    parseFloat(value).toLocaleString('es-MX',{style: 'currency', currency: 'MXN'}) :
                    value.toLocaleString('es-MX',{style: 'currency', currency: 'MXN'}) ;
        } else {
            const nulo = 0.00;
            return typeof(nulo) == 'string' ? 
                    parseFloat(nulo).toLocaleString('es-MX',{style: 'currency', currency: 'MXN'}) :
                    nulo.toLocaleString('es-MX',{style: 'currency', currency: 'MXN'}) ;
        }
    }

    
    const formatDate = (value: Date) =>{
        if (value) {
            return value.toLocaleDateString('es-MX', {
                day:    '2-digit',
                month:  '2-digit',
                year:   'numeric',
            });
        } else { return ''; }
    }

    const formatDateTime = (date:string,tipo:string = 'API') =>{
        const fecha = new Date(date.replace('Z',''));
        const day = fecha.getDate();
        let sday = day.toString();
        sday = sday.padStart(2,'0');
        const month = fecha.getMonth()+1;
        let smonth = month.toString();
        smonth = smonth.padStart(2,'0');
        const year = fecha.getFullYear();
        const hour = fecha.getHours();
        const min = fecha.getMinutes();
        let shour = hour.toString();
        shour = shour.padStart(2,'0');
        let smin = min.toString();
        smin = smin.padStart(2,'0');
        if (tipo == "SHOW") {
            return `${sday}-${smonth}-${year} ${shour}:${smin}`;
        } else if (tipo == "SHOWNOTIME"){
            return `${sday}-${smonth}-${year}`;
        } else {
            return `${year}-${smonth}-${sday} ${shour}:${smin}`;
        }
    }

    const formatDateTime2 = (date:string,tipo:string = 'API') =>{
        const fecha = new Date(date);
        const day = fecha.getDate();
        let sday = day.toString();
        sday = sday.padStart(2,'0');
        const month = fecha.getMonth()+1;
        let smonth = month.toString();
        smonth = smonth.padStart(2,'0');
        const year = fecha.getFullYear();
        const hour = fecha.getHours();
        const min = fecha.getMinutes();
        const shour = hour.toString().padStart(2,'0');
        const smin = min.toString().padStart(2,'0');
        if (tipo == 'API'){
            return `${year}-${smonth}-${sday} 00:00`;
        } else {
            return `${sday}-${smonth}-${year} ${shour}:${smin}`;
        }
    }

    const restardias = (fecha:Date, dias:number) =>{
        const fechainterna = new Date(fecha.getFullYear(),fecha.getMonth(), fecha.getDate());
        fechainterna.setDate(fechainterna.getDate() - dias);
        return fechainterna;
    }

    const getLocalIP = async ():Promise<string> => {
        let ip = '127.0.0.1';
        await fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                ip = String(data.ip);
            })
            .catch(error => {
                ip = '127.0.0.1';
            });
        return ip;
    }

    return {
        formatNumber,
        formatNumber2Dec,
        formatCurrency,
        formatDate,
        formatDateTime,
        formatDateTime2,
        convertTMZdate,
        convertTMZtime,
        convertTMZdatetime,
        restardias,
        getLocalIP,
    }

}

export default useUtilerias;

