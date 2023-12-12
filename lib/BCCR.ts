'use strict';

import axios from 'axios';
import * as querystring from 'querystring';
import { DOMParser } from 'xmldom';
import { getFormattedTodayDate, validateRequest, validateResponse } from './helpers';

interface BCCRResponse {
    compra: string;
    venta: string;
}

const BCCR = async (
    email: string,
    token: string,
    from = getFormattedTodayDate(),
    to = getFormattedTodayDate(),
    indicadores = [317, 318],
    nombre = 'N',
    subNiveles = 'N'
): Promise<BCCRResponse> => {
    validateRequest(email, token, from, to);

    try {
        const axiosRequests = indicadores.map((indicador) =>
            axios.post(
                'https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicos',
                querystring.stringify({
                    FechaInicio: from,
                    FechaFinal: to,
                    Nombre: nombre,
                    SubNiveles: subNiveles,
                    Indicador: indicador,
                    CorreoElectronico: email,
                    Token: token,
                })
            )
        );

        const [compra, venta] = await axios.all([...axiosRequests]);

        const compraNode:any = new DOMParser().parseFromString(compra.data, 'text/xml');
        const ventaNode:any = new DOMParser().parseFromString(venta.data, 'text/xml');


        if (validateResponse(compraNode, ventaNode)) {
            return {
                compra: Math.pow(parseFloat(compraNode.documentElement.getElementsByTagName('NUM_VALOR')[0].childNodes[0].nodeValue), 1).toFixed(2),
                venta: Math.pow(parseFloat(ventaNode.documentElement.getElementsByTagName('NUM_VALOR')[0].childNodes[0].nodeValue), 1).toFixed(2),
            };
        } else {
            throw new Error('Error en la validación de la respuesta.');
        }
    } catch (e:any) {
        throw new Error(e);
    }
};

module.exports.default = BCCR;
module.exports = BCCR;