// lib/helpers.ts
import { DOMParser } from '@xmldom/xmldom';
import { BCCRValidationError, BCCRWebServiceError } from './errors.js';

// Definimos una interfaz para los parámetros de validación
interface ValidationParams {
    email: string;
    token: string;
    from: string;
    to: string;
}

const isValidDateFormat = (date: string): boolean => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return dateRegex.test(date);
};

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
};

export const validateRequest = ({ email, token, from, to }: ValidationParams): void => {
    if (!email) throw new BCCRValidationError('Email is required.');
    if (!isValidEmail(email)) throw new BCCRValidationError('The provided email has an invalid format.');
    if (!token) throw new BCCRValidationError('Token is required.');
    if (!from || !to) throw new BCCRValidationError('Both "from" and "to" dates are required.');
    if (!isValidDateFormat(from) || !isValidDateFormat(to)) {
        throw new BCCRValidationError("One or both dates are invalid. Required format is 'DD/MM/YYYY'.");
    }
};

export const getFormattedTodayDate = (): string => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
};

export const extractValueFromXML = (xmlString: string): number | null => {
    const doc = new DOMParser().parseFromString(xmlString, 'text/xml');
    const valueNode = doc.getElementsByTagName('NUM_VALOR')[0];

    if (valueNode?.childNodes[0]?.nodeValue) {
        return parseFloat(valueNode.childNodes[0].nodeValue);
    }

    const errorMessageNode = doc.getElementsByTagName('string')[0];
    const errorMessageText = errorMessageNode?.childNodes[0]?.nodeValue;

    // Primero verificamos que el texto exista y LUEGO llamamos a .includes()
    if (errorMessageText?.includes('autenticacion')) {
        throw new BCCRWebServiceError('Authentication failed. Please check your email and token.');
    }

    return null;
};