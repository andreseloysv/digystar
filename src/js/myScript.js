const video = document.getElementById("video");
const videoHover = document.getElementById("video-hover");

videoHover.addEventListener('click', handlePlayVideo)
videoHover.addEventListener('touchstart', handlePlayVideo)

function handlePlayVideo(event){
    console.log('video hover');
    videoHover.classList.add('animated', 'fadeOut')
    video.play();
    video.muted = false;
}

video.addEventListener('click', event => {
    console.log('Hola');
    video.play();
    video.muted = false;
});

video.addEventListener('ended',videoEnd);
function videoEnd(event) {
    videoHover.classList.remove("fadeOut");
    videoHover.classList.add('animated', 'fadeIn')
}