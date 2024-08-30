import { ScheduleFormMode } from '../../admin/models/schedule-create-form.model';
import { Schedule, ScheduleRide } from '../../core/models/schedules/schedule.model';
import { AppScheduleFields } from './state-fields';

export interface AppSchedulesState {
    [AppScheduleFields.SCHEDULES]: Schedule[];
    [AppScheduleFields.SCHEDULES_RIDE]: ScheduleRide | null;
    [AppScheduleFields.SHOW_SCHEDULE_FORM]: boolean;
    [AppScheduleFields.SCHEDULE_FORM_MODE]: ScheduleFormMode;
}
