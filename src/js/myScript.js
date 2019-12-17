'use strict';
// Utility section

const addClickAndTouchEventListener = (element, eventHandlerFunction) => {
    element.addEventListener("click", eventHandlerFunction);
    element.addEventListener("touch", eventHandlerFunction);
}

// End of the utility section
//
// ---------------------
//
// Smooth Scroll section

const smoothScroll = (h, callback) => {
    let i = h || 0;
    const step = document.body.scrollHeight/100;
    if (i < document.body.scrollHeight) {
      setTimeout(() => {
        window.scrollTo(0, i);
        smoothScroll(i + step, callback);
      }, 10);
    } else{
        callback()
    }
}

const isInViewport = (element) => {
    const distance = element.getBoundingClientRect();
    return ((distance.y - 80) > 0)
};

const firstFeature = document.getElementById('first-feature');
const header = document.getElementById('header');

window.addEventListener('scroll', (event) => {
    window.requestAnimationFrame(changeNavBarColor);
}, false);

const changeNavBarColor = () => {
    if (isInViewport(firstFeature)) {
        header.classList.remove('white')
        header.classList.add('black')
    } else {
        header.classList.add('white')
        header.classList.remove('black')
    }
}

// End of the smooth scroll section
//
// -------------
//
// Video section

const video = document.getElementById("video")
const videoHover = document.getElementById("video-hover")
const getStartedTopButton = document.getElementById("get-started-top-button")
const inputEmail = document.getElementById("inputEmail")

const handlePlayVideo = async (event) => {
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

const setFocusInputEmail = () => {
    inputEmail.focus();
}

const gotToInputEmail = (event) => {
    smoothScroll(0, setFocusInputEmail)
}

video.addEventListener('click', event => {
    video.play()
    video.muted = false
});

const videoEnd = (event) => {
    videoHover.classList.remove("fadeOut")
    videoHover.classList.add('animated', 'fadeIn')
    gotToInputEmail()
}

addClickAndTouchEventListener(videoHover, handlePlayVideo)
addClickAndTouchEventListener(getStartedTopButton, gotToInputEmail)
video.addEventListener('ended',videoEnd)

// End of the vide section
//
// -----------------
//
// Accordion section

const accordions = document.getElementsByClassName("accordion");

const accordionEventHandler = (accordion) => {
    accordion.classList.toggle("active");
    const panel = accordion.nextElementSibling;
    const icon = accordion.firstElementChild;
    icon.classList.toggle("open");
    panel.classList.toggle("active");
};

Array.prototype.forEach.call(accordions, (accordion) => {
    addClickAndTouchEventListener(accordion, accordionEventHandler.bind(undefined, accordion));
})

// End of the accordion section