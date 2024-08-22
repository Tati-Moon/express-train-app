import { Carriage } from '../../core/models';
import { AppCarriageFields } from './state-fields';

export interface AppCarriagesState {
    [AppCarriageFields.CARRIAGES]: Carriage[];
    [AppCarriageFields.CREATE_CARRIAGE]: boolean;
}
