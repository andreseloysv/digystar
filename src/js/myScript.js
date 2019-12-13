const video = document.getElementById("video")
const videoHover = document.getElementById("video-hover")
const getStartedTopButton = document.getElementById("get-started-top-button")
const inputEmail = document.getElementById("inputEmail")

videoHover.addEventListener('click', handlePlayVideo)
getStartedTopButton.addEventListener('click', gotToInputEmail)
videoHover.addEventListener('touchstart', handlePlayVideo)

function handlePlayVideo(event){
    videoHover.classList.add('animated', 'fadeOut')
    video.play()
    video.muted = false
}

function setFocusInputEmail(){
    inputEmail.focus();
}

function gotToInputEmail(event){
    smoothScroll(0, setFocusInputEmail)
}

video.addEventListener('click', event => {
    video.play()
    video.muted = false
});

video.addEventListener('ended',videoEnd)

function videoEnd(event) {
    videoHover.classList.remove("fadeOut")
    videoHover.classList.add('animated', 'fadeIn')
    gotToInputEmail()
}

const smoothScroll = (h, callback) => {
    let i = h || 0;
    const step = document.body.scrollHeight/100;
    if (i < document.body.scrollHeight) {
      setTimeout(() => {
        window.scrollTo(0, i);
        smoothScroll(i + step, callback);
      }, 10);
    } else{
        console.log(callback);
        callback()
    }
  }