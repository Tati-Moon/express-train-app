import { RouteFormMode } from '../../admin/models/route-create-form.model';
import { PaginationSize } from '../../core/models/enums/constants';
import { Route } from '../../core/models/route/route.model';
import { AppRouteFields } from './state-fields';

export interface AppRoutesState {
    [AppRouteFields.ROUTES]: Route[];
    [AppRouteFields.SHOW_ROUTE_FORM]: boolean;
    [AppRouteFields.ROUTE_FORM_MODE]: RouteFormMode;
    [AppRouteFields.CURRENT_PAGE]: number;
    [AppRouteFields.PAGE_SIZE]: PaginationSize;
}
