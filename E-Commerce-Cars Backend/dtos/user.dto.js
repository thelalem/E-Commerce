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