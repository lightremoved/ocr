
    var ocrApp = angular.module('ocrApp', []);
    ocrApp.controller('mainController', function($scope) {
    
        // Submit the textarea for processing
        $scope.submit = () => {
            $scope.results = {phone: "", name: "", email: ""};
            let parcer = new BusinessCardParcer();
            let contactInfo = parcer.getContactInfo($scope.docInput);
            $scope.results.name = contactInfo.getName();
            $scope.results.phone = contactInfo.getPhoneNumber();
            $scope.results.email = contactInfo.getEmailAddress();
        };
        
        // Init and clear text area and results
        $scope.init = () => {
            $scope.results = {phone: "", name: "", email: ""};
            $scope.docInput = "";
        };
        
        $scope.init();
        
    });


