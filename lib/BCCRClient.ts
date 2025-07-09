// lib/BCCRClient.ts
import axios, { AxiosError } from 'axios';
import querystring from 'querystring';
import { BCCR_BASE_URL, OBTENER_INDICADORES_ECONOMICOS_ENDPOINT, INDICATORS } from './constants.js';
import { validateRequest, getFormattedTodayDate, extractValueFromXML } from './helpers.js';
import {BCCRClientError, BCCRValidationError, BCCRWebServiceError} from './errors.js';

// Interfaces para una API clara y auto-documentada
export interface BCCRClientOptions {
    email: string;
    token: string;
}

export interface ExchangeRateOptions {
    from?: string;
    to?: string;
}

export interface ExchangeRates {
    compra: string;
    venta: string;
}

class BCCRClient {
    private readonly email: string;
    private readonly token: string;

    constructor({ email, token }: BCCRClientOptions) {
        this.email = email;
        this.token = token;
    }

    public async getExchangeRates(
        { from = getFormattedTodayDate(), to = getFormattedTodayDate() }: ExchangeRateOptions = {}
    ): Promise<ExchangeRates> {
        validateRequest({ email: this.email, token: this.token, from, to });

        const requestUrl = `${BCCR_BASE_URL}${OBTENER_INDICADORES_ECONOMICOS_ENDPOINT}`;

        const createRequest = (indicator: number) => {
            const payload = querystring.stringify({
                FechaInicio: from,
                FechaFinal: to,
                Nombre: 'N',
                SubNiveles: 'N',
                Indicador: indicator,
                CorreoElectronico: this.email,
                Token: this.token,
            });
            return axios.post<string>(requestUrl, payload);
        };

        try {
            const [compraResponse, ventaResponse] = await Promise.all([
                createRequest(INDICATORS.COMPRA),
                createRequest(INDICATORS.VENTA),
            ]);

            const compraValue = extractValueFromXML(compraResponse.data);
            const ventaValue = extractValueFromXML(ventaResponse.data);

            if (compraValue === null || ventaValue === null) {
                throw new BCCRWebServiceError('Failed to parse exchange rates from BCCR response. Data might be unavailable for the selected dates.');
            }

            return {
                compra: compraValue.toFixed(2),
                venta: ventaValue.toFixed(2),
            };
        } catch (error) {
            if (error instanceof BCCRClientError) {
                throw error;
            }

            let message = 'An unexpected error occurred.';
            if (error instanceof AxiosError) {
                message = `Network or request error: ${error.message}`;
            } else if (error instanceof Error) {
                message = error.message;
            }

            throw new BCCRWebServiceError(message);
        }
    }
}

export default BCCRClient;