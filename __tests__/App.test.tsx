/**
 * @format
 */
import App from '../App';

describe('App', () => {
  it('được định nghĩa và export hợp lệ', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });
});
