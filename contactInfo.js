class ContactInfo {
    constructor(name, phone, email) {
        this.name = name;
        this.phone = phone;
        this.email = email;
    }
    
    getName() {
        return this.name;
    }
    
    getPhoneNumber() {
        return this.phone;  
    };
    
    getEmailAddress() {
        return this.email;
    }
}