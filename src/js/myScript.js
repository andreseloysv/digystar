const video = document.getElementById("video")
const videoHover = document.getElementById("video-hover")
const getStartedTopButton = document.getElementById("get-started-top-button")
const inputEmail = document.getElementById("inputEmail")

videoHover.addEventListener('click', handlePlayVideo)
getStartedTopButton.addEventListener('click', gotToInputEmail)
videoHover.addEventListener('touchstart', handlePlayVideo)
getStartedTopButton.addEventListener('touchstart', gotToInputEmail)

async function handlePlayVideo(event){
    videoHover.classList.add('animated', 'fadeOut')
    try{
        await video.play()
    } catch(error){
        console.log(error);
    }
    finally{
        video.muted = false
    }
}

function setFocusInputEmail(){
    inputEmail.focus();
}

function gotToInputEmail(event){
    console.log('goToInputEmail')
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


// holaaa
const isInViewport = (element) => {
    const distance = element.getBoundingClientRect();
    return ((distance.y - 60) > 0)
};

const firstFeature = document.getElementById('first-feature');
const header = document.getElementById('header');

window.addEventListener('scroll', function (event) {
    window.requestAnimationFrame(changeNavBarColor);
}, false);

function changeNavBarColor(){
    if (isInViewport(firstFeature)) {
        header.classList.remove('white')
        header.classList.add('black')
    } else {
        header.classList.add('white')
        header.classList.remove('black')
    }
}