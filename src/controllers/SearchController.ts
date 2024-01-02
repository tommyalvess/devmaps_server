import { Request, Response } from 'express';
import Dev from '../models/Dev';
import parseStringAsArray from '../utils/parseStringAsArray';

export default class SearchController {
    async index(req: Request, res: Response) {
        const { latitude, longitude, techs } = req.query;
  
        const techsArray = parseStringAsArray(techs);
    
        const devs = await Dev.find({
          techs: {
            $in: techsArray,
          },
          location: {
            //ele encontra objs perto dessa localizacao
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
              $maxDistance: 10000,
            },
          },
        });
    
        return res.json({ devs });
    }
}