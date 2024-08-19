import { ControlType } from '../../core/models/enums/control-type';

export enum AuthFormFields {
    LOGIN = 'login',
    PASSWORD = 'password',
    REPEAT_PASSWORD = 'repeat_password',
    REMEMBER_ME = 'remember_me',
    NAME = 'name',
    ROLE = 'role',
    ID = 'id',
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

export interface UserProfileForm {
    [AuthFormFields.ID]: ControlType<string>;
    [AuthFormFields.LOGIN]: ControlType<string>;
    [AuthFormFields.PASSWORD]: ControlType<string>;
    [AuthFormFields.NAME]: ControlType<string>;
    [AuthFormFields.ROLE]: ControlType<string>;
}
