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

const smoothScroll = (h, toElement, callback) => {
    const windowScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    const toElementPosition = toElement.offsetTop;
    const step = document.body.scrollHeight/100;

    let i = h || windowScrollPosition;

    if (i < (toElementPosition)) {
      setTimeout(() => {
        window.scrollTo(0, i);
        smoothScroll(i + step, toElement, callback);
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

if (firstFeature) {
    window.addEventListener('scroll', (event) => {
        window.requestAnimationFrame(changeNavBarColor.bind(undefined, firstFeature));
    }, false);
}

const gotToElementById = (elementId) => {
    const element = document.getElementById(elementId)
    if (element) {
        smoothScroll(undefined, element, ()=>{})
    }
}

// End of the smooth scroll section
//
// -------------
//
// Go to input email section

const getStartedTopButton = document.getElementById("get-started-top-button")
const inputEmail = document.getElementById("inputEmail")
const containerInputEmail = document.getElementById("containerInputEmail")

const setFocusInputEmail = () => {
    inputEmail.focus();
}

const gotToInputEmail = (event) => {
    smoothScroll(undefined, containerInputEmail, setFocusInputEmail)
}

addClickAndTouchEventListener(getStartedTopButton, gotToInputEmail)

// End of the smooth scroll section
//
// -------------
//
// Change Nav Bar Color

const changeNavBarColor = (element) => {
    if (isInViewport(element)) {
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
if (video) {
    const videoHover = document.getElementById("video-hover")
    const iconRotateSmartPhone = document.getElementById("icon-smart-phone")

    
    const showIconSmartphoneRotation = () => {
        if (window.innerHeight > window.innerWidth){
            iconRotateSmartPhone.classList.add('active')
        } else {
            iconRotateSmartPhone.classList.remove('active')
        }
    }

    const windowsResize = () => {
        window.requestAnimationFrame(showIconSmartphoneRotation);
    }

    window.addEventListener("resize", windowsResize);
    showIconSmartphoneRotation();
    
    const handlePlayVideo = async (event) => {
        videoHover.classList.add('animated', 'fadeOut')
        try {
            await video.play()
        } catch(error){
            console.log(error);
        }
        finally{
            video.muted = false
        }
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
    video.addEventListener('ended',videoEnd)
}
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
//
// -----------------
//
// Team Page
const teamFeature = document.getElementById("team-feature");
if (teamFeature) {
    const header = document.getElementById("header");
    changeNavBarColor(header);
}
