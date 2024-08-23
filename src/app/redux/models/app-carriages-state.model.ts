import { CarriageFormMode } from '../../admin/models/carriage-create-form.model';
import { Carriage } from '../../core/models';
import { AppCarriageFields } from './state-fields';

export interface AppCarriagesState {
    [AppCarriageFields.CARRIAGES]: Carriage[];
    [AppCarriageFields.SHOW_CARRIAGE_FORM]: boolean;
    [AppCarriageFields.CARRIAGE_FORM_MODE]: CarriageFormMode;
}
