class UserDTO {
    constructor(user) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.username = user.username;
        this.age = user.age
        this.role = user.role;
        this.cartId = user.cart ? user.cart.toString() : null;
    }
}

export default UserDTO;