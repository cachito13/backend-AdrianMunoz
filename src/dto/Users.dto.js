export default class UserDTO {
    constructor(user){
        this.fullname = `${user.name} ${user.surname}`
        this.email = user.email
        this.age = user.age
        this.role = user.role  
    }
}