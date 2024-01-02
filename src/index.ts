import cors from 'cors';
import express from 'express';
import * as http from 'http';
import mongoose from 'mongoose';
import path from 'path';
import routes from './routes';
import { setupWebsocket } from './websocket';

const uri = "mongodb+srv://dev_tom:NsxYNsgynnnSdrsb@cluster0.nfqjfyn.mongodb.net/?retryWrites=true&w=majority";

const app = express()

// Crie uma instância do servidor HTTP
const server = http.createServer(app);

setupWebsocket(server);

mongoose.connect(uri);//Conectando ao banco

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333, () => {
    console.log('Servidor está ouvindo na porta 3333');
});

