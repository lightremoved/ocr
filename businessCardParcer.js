class BusinessCardParcer {
    
    constructor() {
        this.possibleNumbers = [];
        this.results = {phone: "", name: "", email: ""};
    }
    
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
            } else { // Check for international - only numbers
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
    
    selectSinglePhoneNumber() {
        if(this.possibleNumbers.length === 1) { // There is only one phone number match
            this.results.phone = this.possibleNumbers[0].formatted;
        } else {
            this.possibleNumbers.filter((val) => {return !(val.raw.indexOf('F') > -1 || val.raw.indexOf('f') > -1)});
            this.results.phone = this.possibleNumbers[0].formatted; // Assuming only two numbers were submitted
        }
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
    
    // Determine how similar an email address is to an array of strings
    calculateSimilarity(arr) {
        let percentages = [];
        _.each(arr, (element) => {
            let percent = this.calculateDice(element, this.results.email);
            percentages.push({input: element, percent: percent});
        });
            
        //Return the percentages sorted with highest being first
        return percentages.sort((a,b) => {return b.percent - a.percent});
    }
       
        
    // Dice Coefficient Algorithm (derived from several examples online)
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
    
    getContactInfo(document) {
        
        // Split and trim document into an array
        let arr = document.split("\n").map((item) => {
            return item.trim();
        });
        
        // Figure out the phone number(s) and remove it/them from array
        arr = arr.filter((val) => { return !this.isPhoneNumber(val); });
        
        // If you have multiple telephone numbers, attempt to eliminate a fax number.
        this.selectSinglePhoneNumber();
        
        // Figure out email address(es) and remove it/them from array
        arr = arr.filter((val) => {return !this.isEmailAdddress(val); });
        
         // Calculate the percentage of similarity between email and remaining strings
        let percentages = this.calculateSimilarity(arr);
        
        return new ContactInfo(percentages[0].input, this.results.phone, this.results.email);
    }
    
}

    

