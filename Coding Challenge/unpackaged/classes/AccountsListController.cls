public with sharing class AccountsListController {

    @AuraEnabled(cacheable = true)
    public static List<Account> getFinancialAccounts(){
        List<Account> accList= [SELECT Id, Name, Owner.Name, Phone, Website, AnnualRevenue 
                                FROM Account WHERE Industry = 'Financial Services'];
        system.debug('accList'+accList);
        return accList;
    }
}