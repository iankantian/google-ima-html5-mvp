// from Google's SDK Demo
// https://github.com/googleads/googleads-ima-html5/blob/master/simple/ads.js
// but removing the need for Google to have control of the video content of publisher page

/*TODO make a google scoper that will see if the hosting page has the google IMA SDK already, if not, to add it.*/

function googleHTML5(adTag, adContainer, callback) {
    // just load-up and play an ad, standalone.
    var adsManager;
    var adsLoader;
    var adDisplayContainer;
    var intervalTimer;
    callback = callback ? callback : function () {
        console.log('googleHTML5; no callback given, how will the host ' +
            'application know that the ad is done playing?');
    };

    function init() {
        // Create the ad display container.
        adDisplayContainer = new google.ima.AdDisplayContainer(adContainer);
        adsLoader = new google.ima.AdsLoader(adDisplayContainer);
        // Listen and respond to ads loaded and error events.
        adsLoader.addEventListener(
            google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            onAdsManagerLoaded,
            false);
        adsLoader.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            onAdError,
            false);

        // Request video ads.
        var adsRequest = new google.ima.AdsRequest();
        adsRequest.adTagUrl = adTag;

        // Specify the linear and nonlinear slot sizes. This helps the SDK to
        // select the correct creative if multiple are returned.
        adsRequest.linearAdSlotWidth = 640;
        adsRequest.linearAdSlotHeight = 400;

        adsRequest.nonLinearAdSlotWidth = 640;
        adsRequest.nonLinearAdSlotHeight = 150;

        adsLoader.requestAds(adsRequest);
    }

    function playAds() {
        // Initialize the container. Must be done via a user action on mobile devices.
        adDisplayContainer.initialize();
        try {
            // Initialize the ads manager. Ad rules playlist will start at this time.
            adsManager.init(640, 360, google.ima.ViewMode.NORMAL);
            // Call play to start showing the ad. Single video and overlay ads will
            // start at this time; the call will be ignored for ad rules.
            adsManager.start();
        } catch (adError) {
            // An error may be thrown if there was a problem with the VAST response.
        }
    }

    function onAdsManagerLoaded(adsManagerLoadedEvent) {
        // Get the ads manager.
        var adsRenderingSettings = new google.ima.AdsRenderingSettings();
        adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
        // videoContent should be set to the content video element.
        // removing videoContent from the ads manager.  Automatic midroll functions,
        // if google even has that, are thus inactivated by this step.
        adsManager = adsManagerLoadedEvent.getAdsManager(adsRenderingSettings);

        // Add listeners to the required events.
        adsManager.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            onAdError);
        adsManager.addEventListener(
            google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
            onContentPauseRequested);
        adsManager.addEventListener(
            google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
            onContentResumeRequested);
        adsManager.addEventListener(
            google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
            onAdEvent);

        // Listen to any additional events, if necessary.
        adsManager.addEventListener(
            google.ima.AdEvent.Type.LOADED,
            onAdEvent);
        adsManager.addEventListener(
            google.ima.AdEvent.Type.STARTED,
            onAdEvent);
        adsManager.addEventListener(
            google.ima.AdEvent.Type.COMPLETE,
            onAdEvent);
        playAds();
    }

    function onAdEvent(adEvent) {
        // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
        // don't have ad object associated.
        var ad = adEvent.getAd();
        switch (adEvent.type) {
            case google.ima.AdEvent.Type.LOADED:
                // This is the first event sent for an ad - it is possible to
                // determine whether the ad is a video ad or an overlay.
                if (!ad.isLinear()) {
                    // Position AdDisplayContainer correctly for overlay.
                    // Use ad.width and ad.height.
                    videoContent.play();
                }
                break;
            case google.ima.AdEvent.Type.STARTED:
                // This event indicates the ad has started - the video player
                // can adjust the UI, for example display a pause button and
                // remaining time.
                if (ad.isLinear()) {
                    // For a linear ad, a timer can be started to poll for
                    // the remaining time.
                    intervalTimer = setInterval(
                        function () {
                            var remainingTime = adsManager.getRemainingTime();
                        },
                        300); // every 300ms
                }
                break;
            case google.ima.AdEvent.Type.COMPLETE:
                // This event indicates the ad has finished - the video player
                // can perform appropriate UI actions, such as removing the timer for
                // remaining time detection.
                if (ad.isLinear()) {
                    clearInterval(intervalTimer);
                }
                break;
        }
    }

    function onAdError(adErrorEvent) {
        // Handle the error logging.
        console.log(adErrorEvent.getError());
        adsManager.destroy();
    }

    function onContentPauseRequested() {
        // videoContent.pause();
        // This function is where you should setup UI for showing ads (e.g.
        // display ad timer countdown, disable seeking etc.)
        // setupUIForAds();
    }

    function onContentResumeRequested() {
        callback();
        //videoContent.play();
        // This function is where you should ensure that your UI is ready
        // to play content. It is the responsibility of the Publisher to
        // implement this function when necessary.
        // setupUIForContent();
    }

    init();
}

// hostApplication is anything you want it to be
function hostApplication() {
    var adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
        'sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&' +
        'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&' +
        'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';
    var ad_container = document.getElementById('adContainer');
    var videoContent = document.getElementById('contentElement');

    function hostCallBack() {
        try {
            videoContent.play();
        }
        catch (e) {
            console.error('videoContent; ', e);
        }
    }
    googleHTML5(adTagUrl, ad_container, hostCallBack);
}