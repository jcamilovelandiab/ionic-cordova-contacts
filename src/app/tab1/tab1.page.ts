import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public contacts;

  constructor(
  ) {
  }

  searchContact(){
    let readContactsPromise = (response) => {
      console.log(response);
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

  hasPermission(promise){
    window.ContactsX.hasPermission(function(success) {
      promise(success)
    }, function (error) {
      promise(error);
    });
  }

  requestPermission(promise){
    window.ContactsX.requestPermission(function(success) {
      promise(success);
    }, function (error) {
      promise(error);
    });
  }

  readContacts(promise){
    window.ContactsX.find(function(success) {
      promise(success);
    }, function (error) {
      promise(error);
    });
  }

}
