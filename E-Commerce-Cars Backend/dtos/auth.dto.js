import Joi from 'joi';

// Request DTO for login
export class LoginRequestDTO {
    constructor({ email, password }) {
        this.email = email;
        this.password = password;
    }

    static schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'A valid email is required.',
            'string.empty': 'Email is required.',
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters.',
            'string.empty': 'Password is required.',
        }),
    });
}

// Response DTO for login
export class LoginResponseDTO {
    constructor({ token, user }) {
        this.token = token;
        this.user = user;
    }
}