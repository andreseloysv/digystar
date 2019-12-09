var video = document.getElementById("video");
const videoHover = document.getElementById("video-hover");

videoHover.addEventListener('click', handlePlayVideo);
videoHover.addEventListener('touchstart', handlePlayVideo)

function handlePlayVideo(event){
    console.log('video hover');
    video.play();
    video.muted = false;
}

video.addEventListener('click', event => {
    console.log('Hola');
    video.play();
    video.muted = false;
});