
const BCCR = require('./index');

const email = 'YOUR_EMAIL';
const token = 'YOUR_TOKEN';

BCCR(email, token).then((data) => {
    console.log("Compra y Venta del día de hoy:");
    console.log(data);
});

BCCR(email, token, '20/09/2018', '20/09/2018').then((data) => {
    console.log("Compra y Venta por fecha:");
    console.log(data)
});
