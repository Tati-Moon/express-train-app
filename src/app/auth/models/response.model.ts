export interface SignUpErrorResponse {
    error: {
        message: string;
        reason: 'invalidFields' | 'invalidEmail' | 'invalidPassword' | 'invalidUniqueKey';
    };
}

export interface SignInSuccessResponse {
    token: string;
}

export interface SignInErrorResponse {
    error: {
        message: string;
        reason: 'invalidFields' | 'invalidEmail' | 'userNotFound' | 'alreadyLoggedIn';
    };
}

export interface UserProfileSuccessResponse {
    name: string;
    email: string;
    role: 'manager' | 'user';
}
