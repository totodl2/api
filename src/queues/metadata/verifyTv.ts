import Tv from '../../services/tv';
import Search from '../../services/search';
import { FileAttributes } from '../../models/files';

const verifyTv = async (tvId: number) => {
  const tv = await Tv.get<{ files: FileAttributes[] }>(tvId, 'files');

  if (!tv) {
    return `Tv ${tvId} not found`;
  }

  if (tv.files.length > 0) {
    return `Tv ${tv.name} has ${tv.files.length} files attached`;
  }

  await tv.destroy();
  await Search.deleteTvShow(tvId);

  return `Tv ${tv.name} (${tvId}, ${tv.id}) removed `;
};

export default verifyTv;
module.exports = verifyTv; // @todo : remove me
