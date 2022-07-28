import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getFilteredAccounts from '@salesforce/apex/AccountsListController.getFilteredAccounts';

//row actions
const actions=[
    {label:'Edit', name:'edit'}
];

//datable columns
const columns = [
    {
        label: 'Account Name',
        fieldName: 'AccountName',
        type: 'url',
        typeAttributes: {
            label: { fieldName: 'Name' },
            target: '_blank'
        },
        sortable: "true"
    }, {
        label: 'Account Owner',
        fieldName: 'Owner.Name',
        sortable: "true"
    }, {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'Phone'
    }, {
        label: 'Website',
        fieldName: 'Website',
        type: 'Picklist'
    }, {
        label: 'Annual Revenue',
        fieldName: 'AnnualRevenue',
        type: 'Currency'
    }, {
        type:'action',
        typeAttributes: {
            rowActions: actions
        }
    }
];

export default class AccountsList extends NavigationMixin(LightningElement) {

    @track returnedAccounts;
    @track columns = columns;
    @track sortedBy;
    @track sortedDirection;
    @track searchValue;

    //initialization of component
    connectedCallback(){
        this.getAccounts('');
    }

    //sorting method
    handleSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        this.sort(this.sortedBy, this.sortedDirection);
    }

    //filter method
    handleFilter(event) {
        this.searchValue = event.target.value;
        this.getAccounts(this.searchValue);
    }

    //row action method
    handleRowAction(event){
        let row = event.detail.row;

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'edit',
                recordId: row.Id
            },
        });
    }

    getAccounts(filter) {
        getFilteredAccounts({ nameFilter: filter })
            .then((result) => {
                let tempRecs = [];
                result.forEach((record) => {
                    let tempRec = Object.assign({}, record);
                    tempRec.AccountName = '/' + tempRec.Id;
                    tempRecs.push(tempRec);
                });
                this.returnedAccounts = tempRecs;
            })
            .catch((error) => {
                console.log('error' + error);
            })
    }

    sort(field, direction) {
        let tempData = JSON.parse(JSON.stringify(this.returnedAccounts));
        let keyValue = (a) => {
            return a[field];
        };
        let isReverse = direction === 'asc' ? 1 : -1;
        tempData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : '';
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.returnedAccounts = tempData;
    }
}
