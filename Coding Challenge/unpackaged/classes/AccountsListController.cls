public with sharing class AccountsListController {
    @AuraEnabled
    public static List<Account> getFilteredAccounts(String nameFilter){
        if(String.isNotBlank(nameFilter)){
            String accNameFilter = '%'+nameFilter+'%';
            return [SELECT Id, Name, Owner.Name, Phone, Website, AnnualRevenue 
                                FROM Account WHERE Industry = 'Financial Services' AND Name LIKE : accNameFilter
                                WITH SECURITY_ENFORCED];
        }
        else{
            return [SELECT Id, Name, Owner.Name, Phone, Website, AnnualRevenue 
                                FROM Account WHERE Industry = 'Financial Services'
                                WITH SECURITY_ENFORCED];
        }
    }
}
