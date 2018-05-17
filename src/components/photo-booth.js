const PhotoBooth = {
    template: `
        <div>
            <div class="row align-items-center" style="height:430px;">
                <div class="col-md" style="width: 70%; position: absolute; left: 0; top: 35px; padding: 0">
                    <img id="last-snap" style="height: 440px" />
                </div>
                <div class="text-center" style="background-color: white; position: absolute; right: 0; top: 35px; border-left: 5px solid white;">
                    <video id="camera-stream" style="max-width: 240px;"></video>
                    <p>
                        <a href="#" id="take-photo" v-on:click="takeSnapshot()" class="btn btn-primary btn-xl" title="Take Photo">Snap!</a>
                    </p>
                    <canvas class="d-none"></canvas>
                </div>
            </div>
        </div>
    `,
    created: function () {
        // https://tutorialzine.com/2016/07/take-a-selfie-with-js
        navigator.mediaDevices.getUserMedia({
                video: true
            }).then(function(stream) {
                var video = document.querySelector('video#camera-stream');
                // Create an object URL for the video stream and
                // set it as src of our HTLM video element.
                video.src = window.URL.createObjectURL(stream);
                // Play the video element to show the stream to the user.
                video.play();
            }).catch(function(err){
                // Most common errors are PermissionDenied and DevicesNotFound.
                console.error(err);
            }
        );
    },
    mounted: function () {
        if (localStorage.lastSnap) {
            var image = document.querySelector('img#last-snap');
            image && image.setAttribute('src', localStorage.lastSnap);
        }
    },
    methods: {
        // https://jsfiddle.net/dannymarkov/cuumwch5/
        takeSnapshot: function () {
            var hidden_canvas = document.querySelector('canvas'),
                video = document.querySelector('video#camera-stream'),
                image = document.querySelector('img#last-snap'),
                // Get the exact size of the video element.
                width = video.videoWidth,
                height = video.videoHeight,
                // Context object for working with the canvas.
                context = hidden_canvas.getContext('2d');
            // Set the canvas to the same dimensions as the video.
            hidden_canvas.width = width;
            hidden_canvas.height = height;
            // Draw a copy of the current frame from the video on the canvas.
            context.drawImage(video, 0, 0, width, height);
            // Get an image dataURL from the canvas.
            var imageDataURL = hidden_canvas.toDataURL('image/png');
            localStorage.lastSnap = imageDataURL;
            // Set the dataURL as source of an image element, showing the captured photo.
            image.setAttribute('src', imageDataURL);
        }
    }
};
export default PhotoBooth;