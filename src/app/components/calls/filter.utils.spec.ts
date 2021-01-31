import { Filters } from './call/filters';
import { filterCalls } from './filter.utils';
import { Call, CallType, Direction } from '../../core/models';
import { every } from 'lodash';

describe('Filter utils', () => {

  const calls: Call[] = [
    {
      id: 'id1',
      is_archived: false,
      direction: Direction.Outbound,
      call_type: CallType.Answered,
    },
    {
      id: 'id2',
      is_archived: true,
      direction: Direction.Inbound,
      call_type: CallType.Answered,
    },
    {
      id: 'id3',
      is_archived: true,
      direction: Direction.Inbound,
      call_type: CallType.Missed,
    },
    {
      id: 'id5',
      is_archived: false,
      direction: Direction.Inbound,
      call_type: CallType.Voicemail,
    },
  ] as Call[];

  it('Should filter all calls not archieved', () => {
    // given
    const filters = [
      Filters.Answered, Filters.Archieved, Filters.Missed, Filters.Voicemail, Filters.Inbound, Filters.Outbound,
    ];
    // when - then
    expect(every(filterCalls(filters, calls) as Call[], (c) => c.is_archived === true)).toBeTruthy();
  });

  it('Should filter all calls archieved', () => {
    // given
    const filters = [
      Filters.Answered, Filters.NotArchieved, Filters.Missed, Filters.Voicemail, Filters.Inbound, Filters.Outbound,
    ];
    // when - then
    expect(every(filterCalls(filters, calls) as Call[], (c) => c.is_archived === false)).toBeTruthy();
  });

  it('Should filter all calls missed', () => {
    // given
    const filters = [
      Filters.Answered, Filters.Archieved, Filters.NotArchieved, Filters.Voicemail, Filters.Inbound, Filters.Outbound,
    ];
    // when - then
    expect(every(filterCalls(filters, calls) as Call[], (c) => c.call_type !== CallType.Missed)).toBeTruthy();
  });

  it('Should filter all calls answered', () => {
    // given
    const filters = [
      Filters.Missed, Filters.Archieved, Filters.NotArchieved, Filters.Voicemail, Filters.Inbound, Filters.Outbound,
    ];
    // when - then
    expect(every(filterCalls(filters, calls) as Call[], (c) => c.call_type !== CallType.Answered)).toBeTruthy();
  });

  it('Should filter all voicemail calls', () => {
    // given
    const filters = [
      Filters.Missed, Filters.Archieved, Filters.NotArchieved, Filters.Answered, Filters.Inbound, Filters.Outbound,
    ];
    // when - then
    expect(every(filterCalls(filters, calls) as Call[], (c) => c.call_type !== CallType.Voicemail)).toBeTruthy();
  });

  it('Should return all inbound calls', () => {
    // given
    const filters = [
      Filters.Missed, Filters.Archieved, Filters.NotArchieved, Filters.Answered, Filters.Voicemail, Filters.Outbound,
    ];
    // when - then
    expect(every(filterCalls(filters, calls) as Call[], (c) => c.direction !== Direction.Inbound)).toBeTruthy();
  });

  it('Should return all outbound calls', () => {
    // given
    const filters = [
      Filters.Missed, Filters.Archieved, Filters.NotArchieved, Filters.Answered, Filters.Voicemail, Filters.Inbound,
    ];
    // when - then
    expect(every(filterCalls(filters, calls) as Call[], (c) => c.direction !== Direction.Outbound)).toBeTruthy();
  });


});
