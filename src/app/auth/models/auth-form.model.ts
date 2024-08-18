import { ControlType } from '../../core/models/enums/control-type';

export enum AuthFormFields {
    LOGIN = 'login',
    PASSWORD = 'password',
    REPEAT_PASSWORD = 'repeat_password',
    REMEMBER_ME = 'remember_me',
}

export interface LoginForm {
    [AuthFormFields.LOGIN]: ControlType<string>;
    [AuthFormFields.PASSWORD]: ControlType<string>;
    [AuthFormFields.REMEMBER_ME]: ControlType<boolean>;
}

export interface RegisterForm {
    [AuthFormFields.LOGIN]: ControlType<string>;
    [AuthFormFields.PASSWORD]: ControlType<string>;
    [AuthFormFields.REPEAT_PASSWORD]: ControlType<string>;
}
