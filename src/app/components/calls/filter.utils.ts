import { Call } from '../../core/models';
import { Filters } from './call/filters';


export const filterCalls = (filters: Filters[], calls?: Call[]): Call[] | undefined => {
  if (calls === undefined) {
    return undefined;
  }

  return calls.filter((call) =>
    // @ts-ignore
    filters.includes(call.call_type) && filters.includes(call.direction) &&
    (call.is_archived && filters.includes(Filters.Archieved) || !call.is_archived && filters.includes(Filters.NotArchieved)));
};
