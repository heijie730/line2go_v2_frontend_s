import {Injectable} from '@angular/core';
import {TagVo} from "../models/TagVo";
import {FilterTagOption} from "../models/TicketVo";
import {plainToClass, Type} from "class-transformer";
import {Tag} from "../models/QueueVo";

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor() {
  }

  manageQueueKeyPrefix: string = "manage-queue-date:";
  filterStateKeyPrefix: string = "filter-state:";

  getManageQueueState(queueId: string): string | null {
    return sessionStorage.getItem(this.manageQueueKeyPrefix + queueId);
  }

  setManageQueueState(queueId: string, value: string): void {
    return sessionStorage.setItem(this.manageQueueKeyPrefix + queueId, value);
  }

  getFilterState(queueId: StateService): FilterState | null {
    let item = sessionStorage.getItem(this.filterStateKeyPrefix + queueId);
    if (item) {
      return plainToClass(FilterState, JSON.parse(item));
    } else {
      return null;
    }
  }

  setFilterState(queueId: string, filterTagVos: TagVo[], filterTagOption: FilterTagOption): void {
    let filterState = new FilterState();
    filterState.filterTagVos = filterTagVos;
    filterState.filterTagOption = filterTagOption;
    return sessionStorage.setItem(this.filterStateKeyPrefix + queueId, JSON.stringify(filterState));
  }

}

export class FilterState {
  @Type(() => TagVo)
  filterTagVos: TagVo[] = [];
  filterTagOption: FilterTagOption = FilterTagOption.EXCLUDE;

}
