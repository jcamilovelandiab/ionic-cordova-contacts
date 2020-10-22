import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

/**
 * @author Juan Camilo Velandia Botello.
 */
@Component({
    selector: 'contact-modal-component',
    templateUrl: './contact-modal.component.html',
    styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent implements OnInit {

    
    private page: number = 1;//Represents the next page
    private limitContactsPerPage: number = 15;//Contact limit per page.
    private enablePagination: Boolean = false;

    private contacts: any[];//An array with all saved contacts in the phone
    public displayContacts: any[];//All contacts displayed on the screen

    ////Phone pattern to filter contacts. It is used to avoid emergency numbers.
    static PHONE_NUMBER_REGEX: any = /^\+{0,1}[0-9 ]{9,17}$/;

    constructor(
        private modalCtrl: ModalController,
    ) {
    }

    ngOnInit(){
        this.searchContacts();
    }

    /**
     * This function loads all saved contacts in the phone.
     * It was necessary to define promises to control the plugin responses.
     */
    searchContacts(){
        let readContactsPromise = (response) => {
            if(Array.isArray(response)){
                this.contacts = response.filter(
                    user => (
                        user &&
                        user.displayName &&
                        user.phoneNumbers &&
                        user.phoneNumbers.length>0 &&
                        ContactModalComponent.PHONE_NUMBER_REGEX.test(user.phoneNumbers[0])
                    )
                );
                this.displayContacts = this.enablePagination ? 
                    this.contacts.slice(0,this.limitContactsPerPage) : 
                    this.displayContacts = this.contacts;
            }
        }
        let requestPermissionPromise = (response) => {
            console.log(response);
            if(response.read!==undefined && response.read===true){
                this.readContacts(readContactsPromise);
            }
        }
        let hasPermissionPromise = (response) => {
            console.log(response);
            if(response.read!==undefined){
                if(response.read===false){
                    console.log('needs to request permission');
                    this.requestPermission(requestPermissionPromise);
                }else if(response.read===true){
                    this.readContacts(readContactsPromise);
                }
            }
        }
        this.hasPermission(hasPermissionPromise);
    }

    /**
     * Verifies that the app has permissions to request contacts,
     * and when the plugin responds, it calls a promise
     * @param promise 
     */
    hasPermission(promise){
        window['ContactsX'].hasPermission(function(success) {
            promise(success)
        }, function (error) {
            promise(error);
        });
    }

    /**
     * Asks for permissions to request contacts,
     * and when the plugin responds, it calls a promise
     * @param promise
     */
    requestPermission(promise){
        if(window['ContactsX'] !== undefined){

        }
        window['ContactsX'].requestPermission(function(success) {
            promise(success);
        }, function (error) {
            promise(error);
        });
    }

    /**
     * Requests all saved contacts from the phone,
     * and when the plugin responds, it calls a promise
     * @param promise
     */
    readContacts(promise){
        window['ContactsX'].find(function(success) {
            promise(success);
        }, function (error) {
            promise(error);
        });
    }

    dismissModal() {
        // Using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalCtrl.dismiss({
            'dismissed': true
        });
    }

    /**
     * Feature to load contacts per page and display the "loading more contacts" message
     * at the bottom of the screen
     * @param event 
     */
    loadNextPage(event: any) {
        if (!this.enablePagination) return; //pagination is not enabled.
        const low = this.limitContactsPerPage*this.page;
        const high = low+this.limitContactsPerPage;
        const moreData = this.contacts.slice(low, high);
        setTimeout(() => {
            console.log('Done');
            event.target.complete();
            this.displayContacts = [...this.displayContacts, ...moreData];
            this.page++;
            console.log(this.displayContacts.length, this.contacts.length);
            if (this.contacts.length == this.displayContacts.length) {
                event.target.disabled = true;
            }
        }, 200);
    }

    /**
     * 
     * @param phone The selected contact's phone number
     * @param index The array index where the selected contact is located     
     * @param displayName The selected contact's name
     */
    selectContact(phone: string, index: number, displayName: string){
        this.modalCtrl.dismiss({
            'selectedContact': {
                displayName,
                'phoneNumber': phone.replace(/ /g, ''),
                'contactIndex': index,
            },
            'dismissed': false
        });
    }

}