import { Request, Response } from "express";
import knex from "../database/connection";


class PointsController {

    async show(req: Request, res: Response) {
        const { id } = req.params;
        const point = await knex('points').where('id', id).first();

        if (!point)
            return res.status(400).json({ message: 'Point not found' });

        const items = await knex('items')
            .join('points_items', 'items.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id).select('items.title');

        const serializedPoints = {
            ...point,
            image_url: `http://192.168.7.214:3333/uploads/${point.image}`
        };

        return res.json({ point: serializedPoints, items });
    };

    async index(req: Request, res: Response) {
        const { city, uf, items } = req.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('points_items', 'points.id', '=', 'points_items.point_id')
            .whereIn('points_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        const serializedPoints = points.map(point => ({
            ...point,
            image_url: `http://192.168.7.214:3333/uploads/${point.image}`
        }));

        return res.json(serializedPoints);
    };

    async create(req: Request, res: Response) {
        //const image = 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60';
        const image = req.file.filename;
        const { name, email, whatsapp, latitude, longitude, city, uf, items } = req.body;
        const point = {
            image, name, email, whatsapp, latitude, longitude, city, uf
        }
        const trx = await knex.transaction();

        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id
                }
            });

        await trx('points_items').insert(pointItems);

        await trx.commit();

        //trx.commit().then(() => {
        return res.json({
            id: point_id,
            ...point,
            items
        });

        //}).catch(err => {
        //    console.log(err);
        //  return res.json({error: true, message: err.message});
        //});

    };
}

export default PointsController;