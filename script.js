
    var ocrApp = angular.module('ocrApp', []);
    ocrApp.controller('mainController', function($scope) {
    
        $scope.testInput; // The received String document
        $scope.possibleNumbers = []; // If there are more than one phone numbers matched
        $scope.results = {phone: "", name: "", email: ""}; // Display results
        
        let isPhoneNumber = (docElement) => {
            let usPhone = new libphonenumber.parse(docElement.replace(/\D/g,''), 'US').phone;
            if(usPhone) { // Check for US phone number
                $scope.possibleNumbers.push({raw: docElement, formatted: usPhone});
                return true;
            } else { // Check for international
                let internationalPhone = new libphonenumber.parse(docElement, '001').phone;
                if(internationalPhone) {
                    $scope.possibleNumbers.push({raw: docElement, formatted: internationalPhone});
                    return true;
                } else { // Check for international - only numbers
                    let intPhoneFormatted = new libphonenumber.parse(docElement.replace(/\D/g,''), '001').phone;
                    if(intPhoneFormatted) {
                        $scope.possibleNumbers.push({raw: docElement, formatted: intPhoneFormatted});
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        };
        
        // Check if the submitted string element is an email address
        let isEmailAdddress = (docElement) => {
            if(approve.value(docElement, {email: true}).approved) {
                $scope.results.email = docElement;
                return true;
            } else {
                return false;
            }
        };
        
        // Determine how similar an email address is to an array of strings
        let calculateSimilarity = (arr) => {
            let percentages = [];
            _.each(arr, (element) => {
                let percent = calculateDice(element, $scope.results.email);
                percentages.push({input: element, percent: percent});
            });
            
            //Return the percentages sorted with highest being first
            return percentages.sort((a,b) => {return b.percent - a.percent});
        };
       
        
        // Dice Coefficient Algorithm (derived from several examples online)
        let calculateDice = (string1, string2) => {
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
        };
        
        let selectSinglePhoneNumber = () => {
            if($scope.possibleNumbers.length === 1) { // There is only one phone number match
                $scope.results.phone = $scope.possibleNumbers[0].formatted;
            } else {
                $scope.possibleNumbers.filter((val) => {return !(val.raw.indexOf('F') > -1 || val.raw.indexOf('f') > -1)});
                $scope.results.phone = $scope.possibleNumbers[0].formatted; // Assuming only two numbers were submitted
            }
        };
        
        $scope.submit = () => {
            $scope.results = {phone: "", name: "", email: ""};
            let parcer = new BusinessCardParcer();
            let contactInfo = parcer.getContactInfo($scope.testInput);
            $scope.results.name = contactInfo.getName();
            $scope.results.phone = contactInfo.getPhoneNumber();
            $scope.results.email = contactInfo.getEmailAddress();
            // Reset anything left over from a previous click
            
            /*$scope.possibleNumbers = [];
            $scope.results = {phone: "", name: "", email: ""};
            
            // Split and trim document into an array
            let arr = $scope.testInput.split("\n").map((item) => {
                return item.trim();
            });
            
            // Figure out the phone number(s) and remove it/them from array
            arr = arr.filter((val) => { return !isPhoneNumber(val); });
            
            // If you have multiple telephone numbers, attempt to eliminate a fax number.
            selectSinglePhoneNumber();
            
            // Figure out email address(es) and remove it/them from array
            arr = arr.filter((val) => {return !isEmailAdddress(val); });
            
            // Calculate the percentage of similarity between email and remaining strings
            let percentages = calculateSimilarity(arr);
            
            // Set the name equal to the percentage with the highest value
            $scope.results.name = percentages[0].input;*/
        };
        
    });


