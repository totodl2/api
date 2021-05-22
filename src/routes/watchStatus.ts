import Router from 'koa-router';

import Files from '../services/files';
import WatchStatus from '../services/watchStatus';
import { normalize } from '../services/normalizers/watchStatus';
import authenticated from '../middlewares/authenticated';
import getRessource from '../middlewares/getRessource';
import { AddIncludedTypesTo } from '../models/types';
import { FileInstance } from '../models/files';
import { TorrentInstance } from '../models/torrents';
import { JwtType } from '../services/jwt';

const router = new Router();
router.use(authenticated());

const getFileMiddleware = getRessource(
  id => Files.get(id, 'torrent'),
  'params.file',
);

router.get(
  '/files/:file([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  getFileMiddleware,
  async ctx => {
    const {
      entity: file,
      jwt: { id: userId },
    } = ctx.state as {
      entity: AddIncludedTypesTo<FileInstance, { torrent: TorrentInstance }>;
      jwt: JwtType;
    };
    const status = await WatchStatus.find(userId, file);
    ctx.body = status ? normalize(status.dataValues) : null;
  },
);

router.post(
  '/files/:file([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/:position([0-9]+)/:length([0-9]+)',
  getFileMiddleware,
  async ctx => {
    const {
      entity: file,
      jwt: { id: userId },
    } = ctx.state as {
      entity: AddIncludedTypesTo<FileInstance, { torrent: TorrentInstance }>;
      jwt: JwtType;
    };
    const { position, length } = ctx.params as {
      position: string;
      length: string;
    };
    const status = await WatchStatus.upsert(userId, file, {
      position: parseInt(position, 10),
      length: parseInt(length, 10),
    });
    ctx.body = status ? normalize(status.dataValues) : null;
  },
);

module.exports = router; // @todo remove me
export default router;
