// examples/get-rates.ts
import 'dotenv/config'; // Carga el archivo .env
import BCCRClient, { BCCRClientError } from '../index.js';

// Las credenciales deben estar en un archivo .env por seguridad
const email: string | undefined = process.env.BCCR_EMAIL;
const token: string | undefined = process.env.BCCR_TOKEN;

if (!email || !token) {
    console.error('Error: BCCR_EMAIL y BCCR_TOKEN deben estar definidos en tu archivo .env');
    process.exit(1);
}

const client = new BCCRClient({ email, token });

async function main() {
    try {
        console.log("Buscando tipos de cambio para hoy...");
        const todayRates = await client.getExchangeRates();
        console.log("Tipos de cambio de hoy:", todayRates);
        console.log(`  Compra: ₡${todayRates.compra}`);
        console.log(`  Venta: ₡${todayRates.venta}`);

        console.log('\n----------------------------------\n');

        const specificDate = '20/09/2018';
        console.log(`Buscando tipos de cambio para ${specificDate}...`);
        const pastRates = await client.getExchangeRates({
            from: specificDate,
            to: specificDate,
        });
        console.log(`Tipos de cambio para ${specificDate}:`, pastRates);
        console.log(`  Compra: ₡${pastRates.compra}`);
        console.log(`  Venta: ₡${pastRates.venta}`);

    } catch (error) {
        // El manejo de errores ahora puede ser más específico
        if (error instanceof BCCRClientError) {
            console.error(`Error del cliente BCCR: [${error.name}] ${error.message}`);
        } else {
            console.error(`Ocurrió un error inesperado:`, error);
        }
    }
}

main();