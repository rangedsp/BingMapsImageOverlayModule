var ImageOverlay;

(function() {
    var canvasIdNumber = 0;

    function generateUniqueID() {
        var canvasID = 'strechedImg' + canvasIdNumber;
        canvasIdNumber++;

        if (window[canvasID]) {
            return generateUniqueID();
        }

        return canvasID;
    }

    // map - Microsoft.Maps.Map object
    // imageURL - String URL to where the image is located
    // boundingBox - Microsoft.Maps.LocationRect object
    ImageOverlay = function(map, imageURL, boundingBox) {
        var _basePushpin = new Microsoft.Maps.Pushpin(boundingBox.center);
        var _opacity = 1;
        var _id = generateUniqueID();

        function render() {
            var size = calculateSize();

            var pushpinOptions = {
                width: null,
                height: null,
                anchor: new Microsoft.Maps.Point(size.width / 2, size.height / 2),
                htmlContent: "<img id='" + _id + "' style='width:" + size.width + "px;height:" + size.height + "px;opacity:" + _opacity + ";filter:alpha(opacity=" + (_opacity * 100) + ");' src='" + imageURL + "'/>"
            };

            _basePushpin.setOptions(pushpinOptions);
        }

        function calculateSize() {
            var nwPixel = map.tryLocationToPixel(boundingBox.getNorthwest());
            var sePixel = map.tryLocationToPixel(boundingBox.getSoutheast());

            var width = Math.abs(sePixel.x - nwPixel.x);
            var height = Math.abs(nwPixel.y - sePixel.y);
            
            var mapBoundsRect = map.getBounds();
            var isInsideView = mapBoundsRect.contains(boundingBox.center);
            if (!isInsideView) {
                width = 0;
                height = 0;
            }
            return {
                width: width,
                height: height
            };
        }

        _basePushpin.Refresh = function() {
            var size = calculateSize();

            _basePushpin.setOptions({ anchor: new Microsoft.Maps.Point(size.width / 2, size.height / 2) });

            var elm = document.getElementById(_id);

            if (elm) {
                elm.style.width = size.width + 'px';
                elm.style.height = size.height + 'px';
            }
        };

        _basePushpin.SetOpacity = function(opacity) {
            if (opacity >= 0 || opctity <= 1) {
                _opacity = opacity;
                render();
            }
        };

        //Map view change event to resize the image
        Microsoft.Maps.Events.addHandler(map, 'viewchange', function(e) {
            _basePushpin.Refresh();
            if (!e.linear) {
                //Check if zoom level has changed. If it has then resize the pushpin image
            }
        });

        render();

        return _basePushpin;
    };
})();


var ImageOverlayModule = {
    init: function(callback) {
        Microsoft.Maps.registerModule('ImageOverlayModule');

        //Call the Module Loaded method
        Microsoft.Maps.moduleLoaded('ImageOverlayModule');

        Microsoft.Maps.loadModule("ImageOverlayModule", {
            callback: function() {
                callback();
            }
        });
    }
};