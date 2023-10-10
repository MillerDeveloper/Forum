import { ServerFilesPipe } from './server-files.pipe';

describe('ServerFilesPipe', () => {
  it('create an instance', () => {
    const pipe = new ServerFilesPipe();
    expect(pipe).toBeTruthy();
  });
});
