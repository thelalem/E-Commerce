// Request DTO for creating or updating a user
export class UserRequestDTO {
    constructor({ name, email, password, role, profilePicture, address }) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.profilePicture = profilePicture;
        this.address = address;
    }
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