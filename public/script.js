window.addEventListener("load", () => {
    const videoBitrate = 500; //kbps
    const audioBitrate = 100; //kbps

    // Whenever a peer disconnected
    function peerDisconnected(data) {
        const element = document.getElementById(data);
        if (element) element.remove();
    }

    // Whenever we get a stream from a peer
    function receivedStream(stream, simplePeerWrapper) {
        let ovideo = document.createElement("VIDEO");
        ovideo.id = simplePeerWrapper.socket_id;
        ovideo.srcObject = stream;
        ovideo.muted = true;
        ovideo.onloadedmetadata = (e) => {
            ovideo.play();
        };
        document.body.appendChild(ovideo);
        console.log(ovideo);
    }

    // Whenever we get data from a peer
    function receivedData(theData, simplePeerWrapper) {
        document.getElementById("data").innerHTML += theData + "<br />";
    }

    // The video element on the page to display the webcam
    let video = document.getElementById("myvideo");

    // Constraints - what do we want?
    let constraints = { audio: true, video: true };

    // Prompt the user for permission, get the stream
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        /* Use the stream */

        // Attach to our video object
        video.srcObject = stream;

        // Wait for the stream to load enough to play
        video.onloadedmetadata = (e) => {
            video.play();
        };

        // Now setup socket
        const multiPeerConnection = new MultiPeerConnection({
            stream,
            onStream: receivedStream,
            onData: receivedData,
            onPeerDisconnect: peerDisconnected,
            videoBitrate,
            audioBitrate
        });

        const sendDataButton = document.getElementById("sendDataButton");
        const dataInput = document.getElementById("dataInput");

        sendDataButton.addEventListener("click", () => {
            multiPeerConnection.sendData(dataInput.value);
        });
    }).catch((err) => {
        alert(err);
    });
});
