// The contact informatin to be extracted from business card
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