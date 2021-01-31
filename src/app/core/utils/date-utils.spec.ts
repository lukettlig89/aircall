import { isSameDay } from './date-utils';

describe('DateUtils', () => {

  it('isSameDay should return true when the date is equal', () => {
    expect(isSameDay('2021-01-29', '2021-01-29')).toBeTruthy();
  });

  it('isSameDay should return false when the date is not equal', () => {
    expect(isSameDay('2021-01-29', '2020-01-29')).toBeFalsy();
  });

});
