import { Request, Response } from "express";
import knex from "../database/connection";

class ItensController {
    async index(req: Request, res: Response) {
        const items = await knex('items').select('*');
        const serializedItens = items.map(item => ({
            ...item,
            image_url: `http://192.168.7.214:3333/uploads/${item.image}`
        }))
        return res.json(serializedItens);
    };
};

export default ItensController;