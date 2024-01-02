import express from 'express';
import DevController from './controllers/DevController';
import SearchController from './controllers/SearchController';

const routes = express.Router()

const devController = new DevController()
const searchController =  new SearchController()

routes.get('/devs', devController.index);
routes.post('/devs', devController.store);

routes.get('/search', searchController.index);

export default routes;