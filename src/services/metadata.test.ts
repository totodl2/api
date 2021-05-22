import { Metadata, MetadataTypes } from './metadata';

describe('Metadata service', () => {
  it('should be disabled', () => {
    const metadata = new Metadata(null);
    expect(metadata.enabled).toBe(false);
  });

  it('should accept avi extension', () => {
    expect(new Metadata().support('avi')).toBe(true);
  });

  it('should not accept unknown extension', () => {
    expect(new Metadata().support('nop')).toBe(false);
  });

  it('should accept null or undefined', () => {
    expect(new Metadata().support(undefined)).toBe(false);
    expect(new Metadata().support(null)).toBe(false);
  });

  it('should be a movie', async () => {
    const result = await new Metadata().inspect('test.mkv');
    expect(result.type).toBe(MetadataTypes.MOVIE);
  });

  it('should be an episode', async () => {
    const result = await new Metadata().inspect('test s02e01.mkv');
    expect(result.type).toBe(MetadataTypes.EPISODE);
  });
});
