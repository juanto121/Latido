import { useEffect, useState } from 'react';

function useCamera() {

    const [videoStream, setVideoStream] = useState(null)

    useEffect (() => {
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(stream) {
                    setVideoStream(stream)
                }).catch((err) => {
                    console.log("Error using camera", err)
                });
        }
    }, [])

    return videoStream

}

export default useCamera
