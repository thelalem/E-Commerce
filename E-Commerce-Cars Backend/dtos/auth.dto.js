// Request DTO for login
export class LoginRequestDTO {
    constructor({ email, password }) {
        this.email = email;
        this.password = password;
    }
}

// Response DTO for login
export class LoginResponseDTO {
    constructor({ token, user }) {
        this.token = token;
        this.user = user;
    }
}