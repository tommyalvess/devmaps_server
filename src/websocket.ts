import { Server } from 'http';
import * as socketio from 'socket.io';
import { Socket, Server as SocketIOServer } from 'socket.io';
import parseStringAsArray from '../src/utils/parseStringAsArray';
import getDistanceFromLatLonInKm from './utils/calculateDistance';

interface Connection {
  id: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  techs: string[];
}

let io: SocketIOServer;
const connections: Connection[] = [];

export const setupWebsocket = (server: Server): void => {
  io = new socketio.Server(server);

  io.on('connection', (socket: Socket) => {
    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      techs: parseStringAsArray(techs),
    });
  });
};

export const findConnections = (coordinates: { latitude: number; longitude: number }, techs: string[]): Connection[] => {
  return connections.filter(connection => {
    return (
        getDistanceFromLatLonInKm(coordinates, connection.coordinates) < 10 &&
        connection.techs.some(item => techs.includes(item))
    );
  });
};

export const sendMessage = (to: Connection[], message: string, data: any): void => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  });
};
