var entity_id = null;

// Button to click
var div = document.createElement('div');
div.className = 'harvest-timer tau-container view-header__link tau-followlink';
div.style.width = 'auto';
div.style.height = 'auto';

// Get the subdomain of the account
var href = window.location.href;
var pattern = /^https:\/\/(.*?).tpondemand.com\/(.*?)$/
var m = href.match(pattern);
var subdomain = m[1];

// Detect when viewing a card
setInterval(function () {
    var entity = document.getElementsByClassName('entity-id__link');
    if (entity.length != 0 && entity[0].innerHTML != entity_id) {
        entity_id = entity[0].innerHTML;
        attachEntity();
    }
    if (entity.length == 0) {
        entity_id = null;
    }
}, 2000);

// Attach to entity
var attachEntity = function () {

    // Get the title of the story
    var entity_title = document.getElementsByClassName('view-header__entity-title')[0].innerHTML;

    // Get the project for the story
    var entity_project = '';
    if (document.getElementsByClassName('tau-property-project').length > 0) {
        entity_project = document.getElementsByClassName('tau-property-project')[0].innerText;
    }

    div.setAttribute('data-account', JSON.stringify({'id': subdomain}));
    div.setAttribute('data-project', JSON.stringify({'id': entity_project, 'name': entity_project}));
    div.setAttribute('data-item', JSON.stringify({
        'id': entity_id.replace(/\D/g, ''),
        'name': entity_id + ' ' + entity_title
    }));

    // Add the button to the page
    var el = document.getElementsByClassName('view-header__link')[0];
    el.parentNode.insertBefore(div, el);

    // Tell Harvest a new timer was added
    if (document.querySelector("#harvest-messaging")) {
        var event = new CustomEvent("harvest-event:timers:add", {
            detail: {element: document.getElementsByClassName('harvest-timer')[0]}
        });

        document.querySelector("#harvest-messaging").dispatchEvent(event);
    } else {

        // Add the tracking script to the page
        var init = "window._harvestPlatformConfig = { 'applicationName': 'TargetProcess', 'permalink': 'https://%ACCOUNT_ID%.tpondemand.com/entity/%ITEM_ID%'}; var s = document.createElement('script');s.src = '//platform.harvestapp.com/assets/platform.js';s.async = true;var ph = document.getElementsByTagName('script')[0];ph.parentNode.insertBefore(s, ph);";
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.innerHTML = init;
        var ph = document.getElementsByTagName('script')[0];
        ph.parentNode.insertBefore(s, ph);
    }
}

// Overwrite the Harvest pop up to increase z-index
var css = '#harvest-iframe-container, body div#harvest-iframe-container { z-index: 999999 !important; }',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}
head.appendChild(style);
