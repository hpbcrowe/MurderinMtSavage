export class ApplicationUserPasswordReset {

    constructor(
        public username: string,
        public email: string,
        public password: string,
        public confirmPassword: string
    ) {}
}