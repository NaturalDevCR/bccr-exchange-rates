const validateRequest = (email, token, from, to) => {
    switch (true) {
        case !email:
            throw new Error('El email es requerido en la solicitud');
        case !validateEmail(email):
            throw new Error('El email no tiene un formato válido');
        case !token:
            throw new Error('El token es requerido en la solicitud');
        case !validateDate(to) || !validateDate(from):
            throw new Error("Alguna de las fechas ingresadas no es una fecha válida o no cumple con el formato requerido: 'dd/mm/yyyy'");
        default:
            return null;
    }
};

const validateResponse = (compraNode, ventaNode) => {
    const compraIsValid = !!compraNode.documentElement.getElementsByTagName('NUM_VALOR')[0];
    const ventaIsValid = !!ventaNode.documentElement.getElementsByTagName('NUM_VALOR')[0];

    if (compraIsValid && ventaIsValid) {
        return true;
    } else {
        throw new Error('Ha ocurrido un error al procesar la petición, revisa que tus credenciales para el webservice estén correctas');
    }
};

const getFormattedTodayDate = () => {
    const now = new Date();
    return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
};

const validateDate = (date) => {
    const dateRegex = /(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)\d\d))$/;
    return dateRegex.test(date);
};

const validateEmail = (email) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailRegex.test(email)
}

module.exports = { getFormattedTodayDate,  validateRequest, validateResponse }