import { callsReducer } from './reducers';
import { updateCall } from './actions';
import { Call } from '../core/models';

describe('callsReducer ', () => {

  it('should replace the existing call on updateCall', () => {
    const initialCalls = [
      { id: 'id1', is_archived: false },
      { id: 'id2', is_archived: false },
      { id: 'id3', is_archived: false },
      { id: 'id4', is_archived: false },
    ] as Call[];
    const initialState = { nodes: initialCalls, hasNextPage: true, totalCount: 10 };
    const newCall = { id: 'id2', is_archived: true } as Call;

    const action = updateCall({ call: newCall });
    const state = callsReducer(initialState, action);

    initialCalls.splice(1, 1);

    expect(state)
      .toEqual({ ...initialState, nodes: [...initialCalls, newCall] });
  });

  it('should return the previous state if the call was not in the state', () => {
    const initialCalls = [
      { id: 'id1', is_archived: false },
      { id: 'id2', is_archived: false },
      { id: 'id3', is_archived: false },
      { id: 'id4', is_archived: false },
    ] as Call[];
    const initialState = { nodes: initialCalls, hasNextPage: true, totalCount: 10 };
    const newCall = { id: 'id5', is_archived: true } as Call;

    const action = updateCall({ call: newCall });
    const state = callsReducer(initialState, action);

    expect(state)
      .toBe(initialState);
  });
});
