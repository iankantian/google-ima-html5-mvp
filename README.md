Google Ads HTML5 IMA SDK MVP by Josh Brown 2016
----------------------------------------------------
"myIMA.js"

This project is based on the Google [HTML5 IMA SDK](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/).  However I needed several key modifications.  Even though Google's demos are informative, they didn't precisely match my use-case.  I just want to get an ad, and go on with my application's lifecycle.

### Mods
Removed references to client website's video content.  The content owner will be in full control of where and when the ads play, or if their content is even going to be video!  Google does the ads, period.  However, BE AWARE.  If you are using Google "AdRules" to pause your content, and insert mid-rules, stuff like that, this code will not work.

Condensed code into one class 'myIMA', with a 'hostApplication' as placeholder for my client's project.

### Using Function
Include the Google IMA SDK and the demo code:
```html
<script type="text/javascript" src="path_to_myIMA.js"></script>

<!--optional reference to Google's SDK, without it my code will try to load it for you:-->
<script type="text/javascript" src="//imasdk.googleapis.com/js/sdkloader/ima3.js"></script>
```
Then you invoke the function:
```javascript
    var googleAd = new myIMA(adTag, adContainer, callback)
    
    // when you want to play an ad, call it like this:
    googleAd.play()
```
adTag - is any URI that leads to a Google DFP, or Vast compliant XML document.

adContainer - is the DOM element that will show the ad.

optional callback -  However, you really should have a callback from your own host application so it knows when Google is finished playing the ad (or has errored out).