(function () {
    "use strict";

    /**
     * @typedef {{
     *  name: string,
     *  number: string,
     *  status: string,
     *  me: boolean,
     * }} PhoneUser
     */

    // global variables
    /**
     *
     * @type {PhoneChecker}
     */
    var phoneChecker = null;
    //region Phone Checker
    /**
     * Checker class to check for active phones
     *
     * @constructor
     * @param {NodeList} phonesList
     */
    function PhoneChecker (phonesList)
    {
        /**
         * @private
         * @type {NodeList}
         */
        this.domList = phonesList;

        /**
         * @private
         *
         * @type {Array.<PhoneUser>}
         */
        this.phones = this.initializePhones();
    }


    /**
     * Loads all phone data
     *
     * @private
     */
    PhoneChecker.prototype.initializePhones = function ()
    {
        var currentUserName = document.querySelector("#control_panel_username").textContent.trim();

        var phones = {};

        [].forEach.call(
            this.domList,
            /**
             * @param {HTMLElement} cubiclePhoneState
             */
            function (cubiclePhoneState)
            {
                var id = cubiclePhoneState.getAttribute("id");
                var name = cubiclePhoneState.querySelector(".phoneStateName").textContent.trim();

                phones[id] = {
                    name: name,
                    number: cubiclePhoneState.querySelector(".phoneStateNumber").textContent.trim(),
                    me: (currentUserName === name),
                    status: "idle"
                };
            }
        );

        return phones;
    };


    /**
     * Returns the state of the given phone
     *
     * @private
     * @param {HTMLElement} cubiclePhoneState
     */
    PhoneChecker.prototype.getStatusOfPhone = function (cubiclePhoneState)
    {
        var classList = cubiclePhoneState.classList;

        if (classList.contains("phoneState_incomingRinging"))
        {
            return "ringing";
        }

        return "idle";
    };


    /**
     * Checks for changes in the web page
     */
    PhoneChecker.prototype.checkForChanges = function ()
    {
        [].forEach.call(
            this.domList,
            /**
             * @param {HTMLElement} phone
             */
            (phone) => {
                var id = phone.getAttribute("id");
                var currentState = this.getStatusOfPhone(phone);
                var user = this.phones[id];

                if (currentState !== user.status)
                {
                    this.onNewState(user, currentState);
                }

                user.status = currentState;
            }
        );
    };


    /**
     * Callback on when the state of a phone changes
     *
     * @private
     * @param {PhoneUser} user
     * @param {string} newState
     */
    PhoneChecker.prototype.onNewState = function (user, newState)
    {
        var message = null;

        if ("ringing" === newState)
        {
            if (user.me)
            {
                message = "Dein Telefon klingelt.";
            }
            else
            {
                message = "Es klingelt bei " + user.name + ".\nTelefonat ranholen mit *9" + user.number
            }
        }

        if (message)
        {
            new Notification("Becklyn Studios Telefonanlage", {
                body: message
            });
        }
    };
    //endregion

    // check for phone list - this acts as the "loaded" event
    checkForPhonesListLoaded();


    /**
     * Continuously checks whether the phone list is already loaded
     */
    function checkForPhonesListLoaded ()
    {
        var phonesList = document.querySelectorAll("#pulldown_list_internal .cubiclePhoneState");

        if (!!phonesList.length)
        {
            onPhonesLoaded(phonesList);
            return;
        }

        window.setTimeout(checkForPhonesListLoaded, 500);
    }

    function onPhonesLoaded (phonesList)
    {
        // first hide the preferences and the callprogress container
        document.getElementById("prefsActivator").style.display = "none";
        document.getElementById("callprogress_container").style.display = "none";

        phoneChecker = new PhoneChecker(phonesList);

        // start the interaction loop
        interactionLoop();
    }


    /**
     * The main interaction loop
     */
    function interactionLoop ()
    {
        phoneChecker.checkForChanges();

        window.setTimeout(interactionLoop, 500);
    }

})();


