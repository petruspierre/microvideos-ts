import { lastValueFrom, of } from 'rxjs';
import { WrapperDataInterceptor } from './wrapper-data.interceptor';

describe('WrapperDataInterceptor', () => {
  let interceptor: WrapperDataInterceptor;

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor();
  });

  it('should wrap with data key', async () => {
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of({ name: test }),
    });

    const result = await lastValueFrom(obs$);
    expect(result).toEqual({ data: { name: test } });
  });

  it('should not wrap when meta key is present', () => {
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of({ meta: { name: test } }),
    });

    obs$.subscribe((result) => {
      expect(result).toEqual({ meta: { name: test } });
    });
  });
});
