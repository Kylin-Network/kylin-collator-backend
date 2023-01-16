import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import { getConnection, Between } from "typeorm";
import { User } from "../entities/User";
import { Feed } from "../entities/Feed";
import { FeedSource } from "../entities/FeedSource";
import { FeedHistory } from 'src/entities/FeedHistory';
import { paramMissingError } from '../shared/constants';
import logger from '../shared/Logger';
import datasource from '../../datasource.config'

// Init shared
const router = Router();


/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/list', async (req: Request, res: Response) => {
    const feeds = await datasource
        .getRepository(Feed)
        .find({
            select: {
                feedName: true,
                feedDesc: true,
            },
        });
    let ret = { code: 0, message: "ok", data: feeds }
    return res.status(OK).json(ret);
});

/******************************************************************************
 *                      Get User - "GET /api/users/:id"
 ******************************************************************************/

router.get('/sources', async (req: Request, res: Response) => {
    const {name} = req.query;

    const feed = await datasource
        .getRepository(FeedSource)
        .find({

            select: {
                sourceName: true,
                sourceDesc: true,
            },
            where: {
                feed: {
                    feedName: name as string,
                },
            },
        });

    if (!feed) {
        res.status(404);
        res.end();
        return;
    }

    let ret = { code: 0, message: "ok", data: feed }
    return res.status(OK).json(ret);
});


/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/

router.get('/history', async (req: Request, res: Response) => {
    const { name, start, end } = req.query;
    let s = Number(start);
    let e = Number(end);
    let startData = new Date(s * 1000);
    let endData = new Date(e * 1000);

    const feed = await datasource
        .getRepository(FeedHistory)
        .find({
            select: {
                timestamp: true,
                value: true,
            },
            where: {
                timestamp: Between(startData, endData),
                feed: {
                    feedName: name as string,
                },
            },
        });

    if (!feed) {
        res.status(404);
        res.end();
        return;
    }

    let ret = { code: 0, message: "ok", data: feed }
    return res.status(OK).json(ret);
});


/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    await getConnection()
        .createQueryBuilder()
        .delete()
        .from(User)
        .where("id = :id", { id: id })
        .execute();
    return res.status(OK).end();
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
