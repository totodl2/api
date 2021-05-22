import Router from 'koa-router';

import Files from '../services/files';
import authenticated from '../middlewares/authenticated';
import Transcoder from '../services/transcoder';
import getRessource from '../middlewares/getRessource';
import { Roles } from '../services/roles';
import { FileInstance } from '../models/files';

const router = new Router();

router.post(
  '/queue/:file([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  authenticated({ role: Roles.ROLE_ADMIN }),
  getRessource(id => Files.get(id), 'params.file'),
  async ctx => {
    ctx.body = await Transcoder.transcode(ctx.state.entity as FileInstance);
  },
);

module.exports = router; // @todo remove me
export default router;
