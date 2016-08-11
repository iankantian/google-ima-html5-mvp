/**
 *  myIMA.js
 *  Created by joshuabrown on 8/5/16.
 *  I want a very simple class I can call for
 *  'get me an ad!' to google's SDK.
 */

var myIMA = function (adTag, adContainer, callback) {
    this.video_ = {
        duration: 1.00,
        currentTime: 0.50
    };
    this.adTag_ = adTag ? adTag : '';
    this.adContainer_ = adContainer ? adContainer : function() {
        // at least attempt to make something!
        var emptyDiv = document.createElement('div');
        document.body.appendChild( emptyDiv );
        return emptyDiv;
    };
    this.callback_ = callback ? callback : function (){};
};

myIMA.prototype.sdkLoader = function (success, failure) {
    var self = this;
    var success_ = success ? success : function () {
        console.log('no sdkLoader success callback given');
    };
    var failure_ = failure ? failure : function ( error ) {
        console.log('no sdkLoader failure', error );
    };
    var scripts = document.getElementsByTagName('script');
    var script;
    for (script = 0; script < scripts.length; script += 1) {
        if (scripts[script].src.includes('imasdk.googleapis.com/js/sdkloader')) {
            console.log('has google sdk');
            return success_();
        }
    }
    var gsdk = document.createElement('script');
    gsdk.async = true;
    gsdk.type = 'text/javascript';
    gsdk.src = 'http://imasdk.googleapis.com/js/sdkloader/ima3.js';
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gsdk, node);

    var googleCounter = 200;
    var googleWait = setInterval(function () {
        try {
            if (google.ima) {
                console.log('google ima sdk loaded');
                clearInterval(googleWait);
                success_.call(self);
            }
            else if (googleCounter < 0) {
                clearInterval(googleWait);
                console.error('google ima sdk unavailable for 2 seconds after injection');
                failure_.call(self);
            }
            else {
                console.log('waiting on google...');
                googleCounter -= 1;
            }
        }
        catch (e) {
            //failure_(e);
        }
    }, 10);
};

myIMA.prototype.contain = function () {
    console.log('contain and this is', this);
    this.adDisplayContainer =
        new google.ima.AdDisplayContainer(this.adContainer_, this.video_);
    // Must be done as the result of a user action on mobile
    this.adDisplayContainer.initialize();
};

myIMA.prototype.loader = function () {
    console.log('loader and this is', this);
    var self = this;
    var boundManaged = function( event ){
      self.manage.call(self, event);
    };
    this.adsLoader = new google.ima.AdsLoader(this.adDisplayContainer, this.video_);
    // Add event listeners
    this.adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        boundManaged,
        false);
    this.adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        self.onAdError,
        false);
};

myIMA.prototype.resume = function () {
    console.log('myIMA; resume;');
    // go back to control via your app.
    this.callback_();
};


myIMA.prototype.manage = function ( adsManagerLoadedEvent ) {
    var self = this;
    console.log('manage and this is', this);
    this.adsManager = adsManagerLoadedEvent.getAdsManager();
    this.adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        self.onAdError);
    this.adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        self.resume);
    try {
        // Initialize the ads manager. Ad rules playlist will start at this time.
        this.adsManager.init(640, 360, google.ima.ViewMode.NORMAL);
        // Call start to show ads. Single video and overlay ads will
        // start at this time; this call will be ignored for ad rules, as ad rules
        // ads start when the adsManager is initialized.
        this.adsManager.start();
    } catch (adError) {
        console.log('myIMA; manage; error', adError);
        // An error may be thrown if there was a problem with the VAST response.
    }
};

myIMA.prototype.onAdError = function (adErrorEvent) {
    console.log('onAdError and this is', this);
    console.log(adErrorEvent.getError());
    this.adsManager.destroy();
};

myIMA.prototype.play = function () {
    console.log('play and this is', this);
    //this.adsLoader.requestAds( this.adsRequest );
};

myIMA.prototype.request = function () {
    // Request video ads.
    console.log('request and this is', this);
    this.adsRequest = new google.ima.AdsRequest();
    this.adsRequest.adTagUrl = this.adTag_;

    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    this.adsRequest.linearAdSlotWidth = 640;
    this.adsRequest.linearAdSlotHeight = 400;
    this.adsRequest.nonLinearAdSlotWidth = 640;
    this.adsRequest.nonLinearAdSlotHeight = 150;
    this.adsLoader.requestAds( this.adsRequest );
    //return this.adsRequest;
};

myIMA.prototype.init = function(){
    var self = this;
    var success = function(){
        console.log('success this is', this);
        self.contain();
        self.loader();
        self.request();
    };
    var failure = function(){
        //console.log('failure this is', this);
    };
    this.sdkLoader( success, failure );
};