# BCCR Exchange Rates Client (TypeScript)

[![npm version](https://img.shields.io/npm/v/bccr-exchange-rates.svg)](https://www.npmjs.com/package/bccr-exchange-rates)

A modern, reliable, and **TypeScript-based** client to get the daily USD exchange rate (buy/sell) from the official Web Service of the Banco Central de Costa Rica (BCCR).

This package is fully typed, providing an excellent developer experience with autocompletion and compile-time error checking.

## Features

-   **Type-Safe:** Written entirely in TypeScript.
-   **Class-based, modern API.**
-   Uses ES Modules.
-   Robust error handling with custom error types.
-   Lightweight and focused.

## Requirements

-   Node.js v18 or higher.
-   You must enroll in the [BCCR Web Service](https://www.bccr.fi.cr/seccion-indicadores-economicos/servicio-web) to get a valid email and token.

## Installation

    npm install bccr-exchange-rates

## Requirements

-   Node.js v18 or higher.
-   You must enroll in the [BCCR Web Service](https://www.bccr.fi.cr/seccion-indicadores-economicos/servicio-web) to get a valid email and token.


## Usage

The package exports a `BCCRClient` class and its associated types. It's highly recommended to use environment variables for your credentials.


## Error Handling

The client throws specific, typed errors. You can import them to handle different failure scenarios gracefully.

-   `BCCRValidationError`: For invalid input parameters.
-   `BCCRWebServiceError`: For errors from the BCCR API or parsing issues.


## Building from Source

If you clone the repository, you can build the project from the TypeScript source files.