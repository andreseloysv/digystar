var video = document.getElementById("video");
video.addEventListener('click', event => {
    video.play();
    video.muted = false;
});