Google Ads HTML5 IMA SDK MVP by Josh Brown 2016
----------------------------------------------------

This project is based on the Google [HTML5 IMA SDK](https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/).  However I needed several key modifications.  Even though Google's demos are informative, they didn't precisely match my use-case.  I just want to get an ad and go on with my application's lifecycle.

### Mods
    * Removed references to client website's video content.  The content owner will be in full control of where and when the ads play, or if their content is even going to be video!  Google does the ads, period.
    * Condensed code into one function 'googleHTML5', with a 'hostApplication' as placeholder for my client's project.

### Using Function
Include the code with script reference in head or bottom of body element:
```html
<script type="text/javascript" src="googleAds.js"></script>
```
Then in your code you invoke the function:
```javascript
    function googleHTML5(adTag, adContainer, callback)
```
    * adTag is any URI that leads to a Google DFP, or Vast compliant XML document.
    * adContainer is the DOM element that will show the ad.
    * optional callback.  However, you really should have a callback from your own host application so it knows when Google is finished playing the ad (or has errored out).