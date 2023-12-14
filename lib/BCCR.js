'use strict';

const axios = require('axios');
const querystring = require('querystring');
const DOMParser = require('xmldom').DOMParser;
const { getFormattedTodayDate, validateRequest, validateResponse} = require('./helpers')


const BCCR = async (
    email,
    token,
    from = getFormattedTodayDate(),
    to = getFormattedTodayDate(),
    indicadores = [317, 318],
    nombre = 'N',
    subNiveles = 'N'
) => {
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

        const compraNode = new DOMParser().parseFromString(compra.data, 'text/xml');
        const ventaNode = new DOMParser().parseFromString(venta.data, 'text/xml');


        if (validateResponse(compraNode, ventaNode)) {
            return {
                compra: Math.pow(parseFloat(compraNode.documentElement.getElementsByTagName('NUM_VALOR')[0].childNodes[0].nodeValue), 1).toFixed(2),
                venta: Math.pow(parseFloat(ventaNode.documentElement.getElementsByTagName('NUM_VALOR')[0].childNodes[0].nodeValue), 1).toFixed(2),
            };
        } else {
            throw new Error('Error en la validación de la respuesta.');
        }
    } catch (e) {
        throw new Error(e);
    }
};

module.exports.default = BCCR;
module.exports = BCCR;