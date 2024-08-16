export enum Routers {
    ROOT = '/',
    EMPTY_ROOT = '',
    ACCESS = 'access',
    ERROR = 'error',
    LOGOUT = 'logout',
    NOT_FOUND = '404',
    USER_PROFILE = 'profile',
    SETTINGS = 'settings',
    SIGNUP = 'signup',
    SIGNIN = 'signin',
    TRIP = 'trip',
    TRIP_WITH_RIDE_ID = 'trip/:rideId',
    ORDERS = 'orders',
    ADMIN = 'admin',
    STATIONS = 'stations',
    CARRIAGES = 'carriages',
    ROUTES = 'routes',
    ROUTE = 'route',
    ROUTE_WITH_ID = 'route/:id',
}

export const enum RoutersParams {
    ID = ':id',
}
