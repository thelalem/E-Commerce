
import Joi from 'joi';

export class UserRequestDTO {
    constructor({ name, email, password, role, profilePicture, address }) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.profilePicture = profilePicture;
        this.address = address;
    }

    static schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Name is required and must be a string.',
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Valid email is required.',
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters.',
        }),
        role: Joi.string().valid('buyer', 'seller').optional().messages({
            'any.only': 'Role must be either buyer or seller.',
        }),
        profilePicture: Joi.string().optional().messages({
            'string.base': 'Profile picture must be a string.',
        }),
        address: Joi.string().optional().messages({
            'string.base': 'Address must be a string.',
        }),
    });
}

// Response DTO for returning user data
export class UserResponseDTO {
    constructor({ _id, name, email, role, profilePicture, address, createdAt, updatedAt }) {
        this.id = _id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.profilePicture = profilePicture;
        this.address = address;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}