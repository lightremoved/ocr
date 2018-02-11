/*
* Responsible for processing String input and extracting the name, phone, and email address.
*
* Expected Input: String with new lines as delimiter.
* 
* Email address: Extracted using Approve.js
* Phone number: Extracted using LibPhonenumber.js to check for U.S. and international numbers.
* Name: Extracted using Dice Coefficient Algorithm to compute similarity of strings and email address. Note, my
* other solution for extracting names included using a RESTful nameAPI that returned the likiness of a string
* being a person's name. This ended up not being practical for this exercise as that particular set of endpoints were not
* completey free to use.
*/

class BusinessCardParcer {
    
    // possibleNumbers: Array to hold any potential phone number matches
    // results: The results of this processor
    constructor() {
        this.possibleNumbers = [];
        this.results = {phone: "", name: "", email: ""};
    }
    
    // Check if the submitted string element is an email address
    isEmailAdddress(docElement) {
        if(approve.value(docElement, {email: true}).approved) {
            this.results.email = docElement;
            return true;
        } else {
            return false;
        }
    }
    
    // Check if a string is a possible phone number.
    isPhoneNumber(docElement) {
        let usPhone = new libphonenumber.parse(docElement.replace(/\D/g,''), 'US').phone;
        if(usPhone) { // Check for US phone number
            this.possibleNumbers.push({raw: docElement, formatted: usPhone});
            return true;
        } else { // Check for international
            let internationalPhone = new libphonenumber.parse(docElement, '001').phone;
            if(internationalPhone) {
                this.possibleNumbers.push({raw: docElement, formatted: internationalPhone});
                return true;
            } else { // Check for international - all non-numeric characters removed
                let intPhoneFormatted = new libphonenumber.parse(docElement.replace(/\D/g,''), '001').phone;
                if(intPhoneFormatted) {
                    this.possibleNumbers.push({raw: docElement, formatted: intPhoneFormatted});
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
    
    // If you have multiple phone numbers as a match, choose the one that isn't a fax number
    selectSinglePhoneNumber() {
        if(this.possibleNumbers.length === 1) { // There is only one phone number match
            this.results.phone = this.possibleNumbers[0].formatted;
        } else if(this.possibleNumbers.length === 0) { // No phone numbers
            this.results.phone = "";  
        } else { // Filter out any phone option that potentially has something fax related in the string
            this.possibleNumbers.filter((val) => {return !(val.raw.indexOf('F') > -1 || val.raw.indexOf('f') > -1)});
            this.results.phone = this.possibleNumbers[0].formatted; // Assuming only two numbers were submitted
        }
    }
    
    // Determine how similar an email address is to an array of strings
    calculateSimilarity(arr) {
        
        // Check if there is an email address to compare strings against
        if(this.results.email && this.results.email !== "") {
            
            // If so, calculate the percentages of similarity
            let percentages = [];
            _.each(arr, (element) => {
                let percent = this.calculateDice(element, this.results.email);
                percentages.push({input: element, percent: percent});
            });
            
            //Return the percentages sorted with highest being first
            if(percentages.length > 0) {
                return percentages.sort((a,b) => {return b.percent - a.percent});    
            } else {
                return [{input: ""}];
            }
        } else { // There was no email supplied, return an empty result
            return [{input: ""}];
        }
    }
       
        
    // Dice Coefficient Algorithm (derived from several examples online, not my own creation)
    calculateDice(string1, string2) {
        var intersection = 0;
        var length1 = string1.length - 1;
        var length2 = string2.length - 1;
        if(length1 < 1 || length2 < 1) return 0;
        var bigrams2 = [];
        for(var i = 0; i < length2; i++) {
            bigrams2.push(string2.substr(i,2));
        }
        for(var i = 0; i < length1; i++) {
            var bigram1 = string1.substr(i, 2);
            for(var j = 0; j < length2; j++) {
                if(bigram1 == bigrams2[j]) {
                    intersection++;
                    bigrams2[j] = null;
                    break;
                }
            }
        } 
        return (2.0 * intersection) / (length1 + length2);  
    }
    
    // Before returning results, make sure the result exists and are not empty
    validateResults() {
        for(let key in this.results) {
            if(!this.results[key] || this.results[key] === "") {
                this.results[key] = "Not Available";
            }
        }
    }
    
    // Minimal input check for existence and new line delimited
    isValidDocument(doc) {
        if(doc) {
            if(doc.split("\n").length > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    
    // The main execution path.
    getContactInfo(document) {
        
        // Check for a valid new line delimited string
        if(this.isValidDocument(document)) {
        
            // Split and trim document into an array
            let arr = document.split("\n").map((item) => {
                return item.trim();
            });
        
            // Figure out the phone number(s) and remove it/them from array trimmed array
            arr = arr.filter((val) => { return !this.isPhoneNumber(val); });
        
            // If you have multiple telephone numbers, attempt to eliminate a fax number.
            this.selectSinglePhoneNumber();
        
            // Figure out email address(es) and remove it/them from array
            arr = arr.filter((val) => {return !this.isEmailAdddress(val); });
        
            // Calculate the percentage of similarity between email and remaining strings in array
            let percentages = this.calculateSimilarity(arr);
        
            // Set the name to the highest percentage of match
            this.results.name = percentages[0].input;
        
            // Make sure results exist and are not empty
            this.validateResults();
        
            return new ContactInfo(this.results.name, this.results.phone, this.results.email);
        } else {
            let message = "Invalid input."
            return new ContactInfo(message, message, message);
        }
    }
    
}

    

