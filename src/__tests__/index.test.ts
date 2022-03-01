import { derace } from '../derace';
import { debounce } from '../debounce';
import { throttle } from '../throttle';
import * as index from '../index';

describe('index', () => {
  it('exports derace', () => {
    expect(index.derace).toBe(derace);
  });

  it('exports debounce', () => {
    expect(index.debounce).toBe(debounce);
  });

  it('exports throttle', () => {
    expect(index.throttle).toBe(throttle);
  });
});
