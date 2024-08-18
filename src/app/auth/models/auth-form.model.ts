import { ControlType } from '../../core/models/enums/control-type';

export enum AuthFormFields {
    LOGIN = 'login',
    PASSWORD = 'password',
    REPEAT_PASSWORD = 'repeat_password',
}

export interface LoginForm {
    [AuthFormFields.LOGIN]: ControlType<string>;
    [AuthFormFields.PASSWORD]: ControlType<string>;
}

export interface RegisterForm {
    [AuthFormFields.LOGIN]: ControlType<string>;
    [AuthFormFields.PASSWORD]: ControlType<string>;
    [AuthFormFields.REPEAT_PASSWORD]: ControlType<string>;
}
