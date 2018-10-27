import $ from "jquery";
import slick from "slick-carousel";
import SlideshowVideo from "./slideshowvideo";
let classes = {
  wrapper: "slideshow-wrapper",
  slideshow: "slideshow",
  currentSlide: "slick-current",
  video: "slideshow__video",
  videoBackground: "slideshow__video--background",
  closeVideoBtn: "slideshow__video-control--close",
  pauseButton: "slideshow__pause",
  isPaused: "is-paused"
};
class Slideshow {
  constructor(el) {
    //Establish the slideshow
    this.$slideshow = $(el);
    this.$wrapper = this.$slideshow.closest("." + classes.wrapper);
    this.$pause = this.$wrapper.find("." + classes.pauseButton);
    //Settings for slick slider
    this.settings = {
      accessibility: true,
      arrows: true,
      dots: false,
      fade: false,
      rows: 0,
      draggable: true,
      touchThreshold: 20,
      autoplay: this.$slideshow.data("autoplay"),
      autoplaySpeed: this.$slideshow.data("speed")
    };
    //Events
    this.$slideshow.on("beforeChange", beforeChange.bind(this));
    this.$slideshow.on("init", slideshowA11y.bind(this));
    this.$slideshow.slick(this.settings);

    this.$pause.on("click", this.togglePause.bind(this));
  }
  togglePause() {
    var slideshowSelector = getSlideshowId(this.$pause);
    if (this.$pause.hasClass(classes.isPaused)) {
      this.$pause.removeClass(classes.isPaused);
      $(slideshowSelector).slick("slickPlay");
    } else {
      this.$pause.addClass(classes.isPaused);
      $(slideshowSelector).slick("slickPause");
    }
  }
}
export default Slideshow;
// theme.Slideshow = (function() {
//   this.$slideshow = null;
//   var classes = {
//     wrapper: "slideshow-wrapper",
//     slideshow: "slideshow",
//     currentSlide: "slick-current",
//     video: "slideshow__video",
//     videoBackground: "slideshow__video--background",
//     closeVideoBtn: "slideshow__video-control--close",
//     pauseButton: "slideshow__pause",
//     isPaused: "is-paused"
//   };

//   function slideshow(el) {
//     this.$slideshow = $(el);
//     this.$wrapper = this.$slideshow.closest("." + classes.wrapper);
//     this.$pause = this.$wrapper.find("." + classes.pauseButton);

//     this.settings = {
//       accessibility: true,
//       arrows: false,
//       dots: true,
//       fade: true,
//       draggable: true,
//       touchThreshold: 20,
//       autoplay: this.$slideshow.data("autoplay"),
//       autoplaySpeed: this.$slideshow.data("speed")
//     };

//     this.$slideshow.on("beforeChange", beforeChange.bind(this));
//     this.$slideshow.on("init", slideshowA11y.bind(this));
//     this.$slideshow.slick(this.settings);

//     this.$pause.on("click", this.togglePause.bind(this));
//   }

function slideshowA11y(event, obj) {
  var $slider = obj.$slider;
  var $list = obj.$list;
  var $wrapper = this.$wrapper;
  var autoplay = this.settings.autoplay;

  // Remove default Slick aria-live attr until slider is focused
  $list.removeAttr("aria-live");

  // When an element in the slider is focused
  // pause slideshow and set aria-live.
  $wrapper.on("focusin", function(evt) {
    if (!$wrapper.has(evt.target).length) {
      return;
    }

    $list.attr("aria-live", "polite");

    if (autoplay) {
      $slider.slick("slickPause");
    }
  });

  // Resume autoplay
  $wrapper.on("focusout", function(evt) {
    if (!$wrapper.has(evt.target).length) {
      return;
    }

    $list.removeAttr("aria-live");

    if (autoplay) {
      // Manual check if the focused element was the video close button
      // to ensure autoplay does not resume when focus goes inside YouTube iframe
      if ($(evt.target).hasClass(classes.closeVideoBtn)) {
        return;
      }

      $slider.slick("slickPlay");
    }
  });

  // Add arrow key support when focused
  if (obj.$dots) {
    obj.$dots.on("keydown", function(evt) {
      if (evt.which === 37) {
        $slider.slick("slickPrev");
      }

      if (evt.which === 39) {
        $slider.slick("slickNext");
      }

      // Update focus on newly selected tab
      if (evt.which === 37 || evt.which === 39) {
        obj.$dots.find(".slick-active button").focus();
      }
    });
  }
}

function beforeChange(event, slick, currentSlide, nextSlide) {
  var $slider = slick.$slider;
  var $currentSlide = $slider.find("." + classes.currentSlide);
  var $nextSlide = $slider.find(
    '.slideshow__slide[data-slick-index="' + nextSlide + '"]'
  );
  //See if video on current slide
  if (isVideoInSlide($currentSlide)) {
    console.log("This slide has video");
    var $currentVideo = $currentSlide.find("." + classes.video);
    var currentVideoId = $currentVideo.attr("id");
    // theme.SlideshowVideo.pauseVideo(currentVideoId);
    $currentVideo.attr("tabindex", "-1");
  }
  //See if video in next slide
  if (isVideoInSlide($nextSlide)) {
    console.log("Next slide has video");
    var $video = $nextSlide.find("." + classes.video);
    var videoId = $video.attr("id");
    SlideshowVideo.playVideo(videoId);
    var isBackground = $video.hasClass(classes.videoBackground);
    //If it is a background video, start playing
    if (isBackground) {
      SlideshowVideo.playVideo(videoId);
    } else {
      $video.attr("tabindex", "0");
    }
  }
}

function isVideoInSlide($slide) {
  return $slide.find("." + classes.video).length;
}

//   slideshow.prototype.togglePause = function() {
//     var slideshowSelector = getSlideshowId(this.$pause);
//     if (this.$pause.hasClass(classes.isPaused)) {
//       this.$pause.removeClass(classes.isPaused);
//       $(slideshowSelector).slick("slickPlay");
//     } else {
//       this.$pause.addClass(classes.isPaused);
//       $(slideshowSelector).slick("slickPause");
//     }
//   };

function getSlideshowId($el) {
  return "#Slideshow-" + $el.data("id");
}

//   return slideshow;
// })();
