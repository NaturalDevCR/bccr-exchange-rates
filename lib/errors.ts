// lib/errors.ts
export class BCCRClientError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BCCRClientError';
    }
}

export class BCCRValidationError extends BCCRClientError {
    constructor(message: string) {
        super(message);
        this.name = 'BCCRValidationError';
    }
}

export class BCCRWebServiceError extends BCCRClientError {
    constructor(message: string) {
        super(message);
        this.name = 'BCCRWebServiceError';
    }
}