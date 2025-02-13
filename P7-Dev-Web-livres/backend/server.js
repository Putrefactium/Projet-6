/**
 * @fileoverview Configuration du serveur HTTP pour l'application
 * @module server
 * @requires http
 * @requires app
 * @requires dotenv
 */

import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Normalise le port en un nombre valide
 * @param {string|number} val - Valeur du port à normaliser
 * @returns {number|string|boolean} Port normalisé ou false si invalide
 */
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || process.env.PORT);
app.set('port', port);

/**
 * Gère les erreurs du serveur
 * @param {Error} error - Erreur survenue
 * @throws {Error} Lance l'erreur si elle n'est pas liée à l'écoute du serveur
 */
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Création du serveur HTTP
 * @type {http.Server}
 */
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
