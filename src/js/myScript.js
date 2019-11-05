var video = document.getElementById("video");
video.addEventListener('click', event => {
    console.log('Hola');
    video.play();
    video.muted = false;
});