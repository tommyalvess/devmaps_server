import axios from 'axios';
import { Request, Response } from 'express';
import Dev from '../models/Dev';
import parseStringAsArray from '../utils/parseStringAsArray';
import { findConnections, sendMessage } from '../websocket';

export default class DevController {
    async index(req: Request, res: Response) {
        const devs = await Dev.find();
        return res.json(devs);
    }

    async store(req: Request, res: Response) {
        try {
            const { github_username, techs, latitude, longitude } = req.body;

            let dev = await Dev.findOne({ github_username });            
    
            if (!dev) {                               
                const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

                if (!apiResponse) {
                    return res.json('Algo deu errado com o user do github');
                }
                            
                const { name, login, avatar_url, bio } = apiResponse.data;

                var realName = name ? name : login
                
                const techsArray = parseStringAsArray(techs);
                
                const location = {
                    type: 'Point',
                    coordinates: [longitude, latitude],
                };
                
                dev = await Dev.create({
                    github_username,
                    name: realName,
                    avatar_url,
                    bio,
                    techs: techsArray,
                    location,
                })

                if (!dev) {
                    console.log(dev);
                    return res.json('Algo deu errado ao criar o user')
                }
            
                // Filtrar as conexões que estão há no máximo 10km de distância
                // e que o novo dev tenha pelo menos uma das tecnologias filtradas
                const sendSocketMessageTo = findConnections(
                    { latitude, longitude },
                    techsArray,
                )
            
                sendMessage(sendSocketMessageTo, 'new-dev', dev);
            }
        
            return res.json(dev);
        } catch (error) {
            //console.log(error);
            return res.json('Algo deu errado')
        }
    }
}