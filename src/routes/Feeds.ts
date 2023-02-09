import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, NOT_FOUND, NOT_ACCEPTABLE } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import { getConnection, Between } from "typeorm";
import { Feed } from "../entities/Feed";
import { FeedSource } from "../entities/FeedSource";
import { FeedHistory } from 'src/entities/FeedHistory';
import { paramMissingError } from '../shared/constants';
import logger from '../shared/Logger';
import datasource from '../../datasource.config'

// Init shared
const router = Router();

/// Get Feed list
///
/// GET /api/feed/list
///
/// # Parameter: null
///  
router.get('/list', async (req: Request, res: Response) => {
    const feed = await datasource
        .getRepository(Feed)
        .find({
            select: {
                feedName: true,
                feedDesc: true,
            },
        });

    if (!feed || !feed.length) {
        let ret = { code: -1, message: "NOT_FOUND", data: {} }
        return res.status(NOT_FOUND).json(ret);
    }

    let ret = { code: 0, message: "OK", data: feed }
    return res.status(OK).json(ret);
});

/// Get Feed sources
///
/// GET /api/feed/sources
///
/// # Parameter:
/// * `name` - Feed name
///  
router.get('/sources', async (req: Request, res: Response) => {
    const { name } = req.query;
    if (!name) {
        let ret = { code: -1, message: "NOT_ACCEPTABLE", data: {} }
        return res.status(NOT_ACCEPTABLE).json(ret);
    }

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

    if (!feed || !feed.length) {
        let ret = { code: -1, message: "NOT_FOUND", data: {} }
        return res.status(NOT_FOUND).json(ret);
    }

    let ret = { code: 0, message: "OK", data: feed }
    return res.status(OK).json(ret);
});

/// Get History Data
///
/// GET /api/feed/history 
///
/// # Parameter:
/// * `name` - Feed name
/// * `start` - start of Unix timestamp
/// * `end` - end of Unix timestamp
///  
interface ReqQuery {
    name: string;
    start: string;
    end: string;
}
router.get('/history', async (
    req: Request<{}, {}, {}, ReqQuery>,
    res: Response,
) => {
    const { name, start, end } = req.query;
    let s = parseInt(start);
    let e = parseInt(end);
    if (!name || isNaN(s) || isNaN(e)) {
        let ret = { code: -1, message: "NOT_ACCEPTABLE", data: {} }
        return res.status(NOT_ACCEPTABLE).json(ret);
    }

    // Unix timestamp to Date oject
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
                    feedName: name,
                },
            },
        });

    if (!feed || !feed.length) {
        let ret = { code: -1, message: "NOT_FOUND", data: {} }
        return res.status(NOT_FOUND).json(ret);
    }

    // Date to Unix timestamp
    let feedData = feed.map((val) => ([
        Math.floor(val.timestamp.getTime() / 1000),
        val.value,
    ]))

    let ret = { code: 0, message: "OK", data: feedData }
    return res.status(OK).json(ret);
});

export default router;
