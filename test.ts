const indicadoresEconomicosBCCR = require('./index');

const email = 'YOUR_EMAIL';
const token = 'YOUR_TOKEN';

indicadoresEconomicosBCCR(email, token).then((data:any) => {
    console.log("Compra y Venta del día de hoy:");
    console.log(data);
});

indicadoresEconomicosBCCR(email, token, '20/09/2018', '20/09/2018').then((data:any) => {
    console.log("Compra y Venta por fecha:");
    console.log(data)
});
