import { ValidatorFn } from '@angular/forms';

export type ControlType<T> = [T, ValidatorFn[]];
