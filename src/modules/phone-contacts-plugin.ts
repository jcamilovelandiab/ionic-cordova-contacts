//Phone pattern to filter contacts. It is used to avoid emergency numbers.
const PHONE_NUMBER_REGEX: any = /^\+{0,1}[0-9 ]{9,17}$/;

/**
 * This function loads all saved contacts in the phone.
 * It was necessary to define promises to control the plugin responses.
 */
export const searchPhoneContacts = (params) => {
    let readContactsPromise = {
        success: function(response){
            if (Array.isArray(response)) {
                var contacts = response.filter(
                    user => (
                        user &&
                        user.displayName &&
                        user.phoneNumbers &&
                        user.phoneNumbers.length > 0 &&
                        PHONE_NUMBER_REGEX.test(user.phoneNumbers[0])
                    )
                );
                console.log(contacts);
                params.success(contacts);
            }
        }, error: function(error){
            console.log(error);
            params.error(error);
        }
    }
    let requestPermissionCallbacks = {
        success: function(response){
            if (response.read !== undefined && response.read === true) {
                readContacts(readContactsPromise);
            }
        }, error: function(error){
            console.log(error);
            params.error(error);
        }
    }
    let hasPermissionCallbacks = {
        success: function(response){
            if (response.read !== undefined) {
                if (response.read === false) {
                    console.log('needs to request permission');
                    requestPermission(requestPermissionCallbacks);
                } else if (response.read === true) {
                    readContacts(readContactsPromise);
                }
            }
        }, error: function(error){
            console.log(error);
            params.error(error);
        }
    }
    hasPermission(hasPermissionCallbacks);
}

/**
 * Verifies that the app has permissions to request contacts,
 * and when the plugin responds, it calls a promise
 * @param promise 
 */
export const hasPermission = (params) => {
    window['ContactsX'].hasPermission(function (success) {
        params.success(success)
    }, function (error) {
        params.error(error);
    });
}

/**
 * Asks for permissions to request contacts,
 * and when the plugin responds, it calls a promise
 * @param promise
 */
export const requestPermission = (params) => {
    console.log('requesting permission...');
    if (window['ContactsX'] !== undefined) {
        window['ContactsX'].requestPermission(function (success) {
            console.log('permission granted');
            params.success(success);
        }, function (error) {
            console.log('permission denied');
            params.error(error);
        });
    }
}

/**
 * Requests all saved contacts from the phone,
 * and when the plugin responds, it calls a promise
 * @param promise
 */
export const readContacts = (params) => {
    window['ContactsX'].find(function (success) {
        params.success(success);
    }, function (error) {
        params.error(error);
    });
}


/**
 * Loads dummy contacts for testing
 */
export const searchDummyPhoneContacts = (params) => {
    setTimeout(() => {
        var contacts = [{
            'displayName': 'Alejandra Gómez',
            'phoneNumbers': ['+507 3457834']
        }, {
            'displayName': 'Camilo Velandia',
            'phoneNumbers': ['+507 2622448']
        }, {
            'displayNames': 'Carmen Teresa',
            'phoneNumbers': ['+507 3453689']
        }, {
            'displayName': 'Daniel Díaz',
            'phoneNumbers': ['+507 786987']
        }, {
            'displayName': 'Daniela Betancur',
            'phoneNumbers': ['+507 0077214']
        }, {
            'displayName': 'Elizabeth Botello',
            'phoneNumbers': ['+507 5681123']
        }, {
            'displayName': 'Erica Rodriguez',
            'phoneNumbers': ['+507 7612480']
        }, {
            'displayName': 'Enrique Campusano',
            'phoneNumbers': ['+507 5641235']
        }, {
            'displayName': 'John Ibañez',
            'phoneNumbers': ['+5073234234']
        }, {
            'displayName': 'Juan Botello',
            'phoneNumbers': ['+507 3672889']
        }, {
            'displayName': 'Luis Daniel',
            'phoneNumbers': ['+507 6786577']
        }, {
            'displayName': 'Tess Sweeney',
            'phoneNumbers': ['+507 2622448']
        }, {
            'displayName': 'Santiago Rocha',
            'phoneNumbers': ['+507 232428']
        }, {
            'displayName': 'Sergio Rodriguez',
            'phoneNumbers': ['+507 9898798']
        }, {
            'displayName': 'Rodriguez Gacha',
            'phoneNumbers': ['+507 5675675']
        }, {
            'displayName': 'Yohanna Toro',
            'phoneNumbers': ['+5073672889']
        }];
        params.success(contacts);
    }, 2000);
}