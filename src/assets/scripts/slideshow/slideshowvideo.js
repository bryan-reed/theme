import $ from "jquery";
import YouTubePlayer from "youtube-player";
import { default as VimeoPlayer } from "@vimeo/player";
let autoplayCheckComplete = false;
let autoplayAvailable = false;
let playOnClickChecked = false;
let playOnClick = false;
// let youtubeLoaded = false;
let videos = {};
let videoPlayers = [];
let videoOptions = {
  ratio: 16 / 9,
  playerVars: {
    // eslint-disable-next-line camelcase
    iv_load_policy: 3,
    modestbranding: 0,
    autoplay: 0,
    controls: 0,
    showinfo: 0,
    wmode: "opaque",
    branding: 0,
    autohide: 1,
    rel: 0,
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerChange
    }
  }
};
let classes = {
  playing: "video-is-playing",
  paused: "video-is-paused",
  loading: "video-is-loading",
  loaded: "video-is-loaded",
  slideshowWrapper: "slideshow-wrapper",
  slide: "slideshow__slide",
  slideBackgroundVideo: "slideshow__slide--background-video",
  slideDots: "slick-dots",
  videoChrome: "slideshow__video--chrome",
  videoBackground: "slideshow__video--background",
  playVideoBtn: "slideshow__video-control--play",
  closeVideoBtn: "slideshow__video-control--close",
  currentSlide: "slick-current",
  slickClone: "slick-cloned",
  supportsAutoplay: "autoplay",
  supportsNoAutoplay: "no-autoplay"
};
function onPlayerReady(e) {
  console.log("THE PLAYER IS READY: " + e);
}
function onPlayerChange(e) {
  console.log("PLAYER STATE CHANGE: ", e);
}
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
// window.mobileCheck = function() {
//   var e = !1;
//   return (
//     (function(t) {
//       (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
//         t
//       ) ||
//         /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
//           t.substr(0, 4)
//         )) &&
//         (e = !0);
//     })(navigator.userAgent || navigator.vendor || window.opera),
//     e
//   );
// };

//TODO:
//If video is playing, pause slideshow
//When video is done or stopped playing, resume slide show

function onYouTubeIframeAPIReady(e) {
  //   console.log("SEEING IF IT IS READY");
  //   SlideshowVideo.loadVideos();
}
class SlideshowVideo {
  constructor() {}
  static init($video) {
    if (!$video.length) {
      return;
    }
    if ($video.data("platform") == "vimeo") {
      videos[$video.attr("id")] = {
        id: $video.data("id"),
        videoId: $video.data("id"),
        platform: $video.data("platform"),
        type: $video.data("type"),
        title: 0,
        byline: 0,
        portrait: 0,
        transparent: 0,
        height: 480,
        width: 640,
        $parentSlide: $video.closest("." + classes.slide),
        $parentSlideshowWrapper: $video.closest("." + classes.slideshowWrapper),
        slideshow: $video.data("slideshow")
      };
    } else {
      videos[$video.attr("id")] = {
        id: $video.attr("id"),
        videoId: $video.data("id"),
        platform: $video.data("platform"),
        type: $video.data("type"),
        status: $video.data("type") === "chrome" ? "closed" : "background", // closed, open, background
        videoSelector: $video.attr("id"),
        $parentSlide: $video.closest("." + classes.slide),
        $parentSlideshowWrapper: $video.closest("." + classes.slideshowWrapper),
        controls: $video.data("type") === "background" ? 0 : 1,
        slideshow: $video.data("slideshow")
      };
    }

    // if (!youtubeLoaded) {
    //   // This code loads the IFrame Player API code asynchronously.
    //   var tag = document.createElement("script");
    //   tag.src = "https://www.youtube.com/iframe_api";
    //   var firstScriptTag = document.getElementsByTagName("script")[0];
    //   firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    // }
  }
  static playVideo(videoId) {
    console.log(videoId, videoPlayers);
    //Pause slideshow
    // videoPlayers[videoId].playVideo();
    //PLay video
  }
  static loadVideo(key) {
    // console.log(key, videos);
    // if (!youtubeLoaded) {
    //   return;
    // }
    var args = $.extend({}, videoOptions, videos[key]);

    if (args.platform == "vimeo") {
      videoPlayers[key] = new VimeoPlayer(key, args);
      videoPlayers[key].on("play", function(data) {
        let $slideshow = $("#" + videos[key].slideshow);
        $slideshow.slick("slickPause");
      });
      videoPlayers[key].on("pause", function(data) {
        let $slideshow = $("#" + videos[key].slideshow);
        $slideshow.slick("slickPlay");
      });
      videoPlayers[key].on("ended", function(data) {
        let $slideshow = $("#" + videos[key].slideshow);
        $slideshow.slick("slickPlay");
      });
      //   videoPlayers[key].ready().then(() => {
      //     videoPlayers[key].setVolume(0);
      //     videoPlayers[key]
      //       .play()
      //       .then(e => {
      //         // console.log(e, "is playing now");
      //       })
      //       .catch(e => console.log(e));
      //   });
      //   videoPlayers[key].on("play", () => {
      //     console.log("IT IS PLAYING");
      //   });
      //   videoPlayers[key].on("play", () => {
      //     console.log("Vimeo played");
      //   });
    } else {
      args.playerVars.controls = args.controls;
      videoPlayers[key] = YouTubePlayer(key, args);
      videoPlayers[key].on("stateChange", e => {
        let $slideshow = $("#" + videos[key].slideshow);
        if (e.data === 1) {
          $slideshow.slick("slickPause");
        } else {
          $slideshow.slick("slickPlay");
        }
      });
      //   videoPlayers[key]
      //     .playVideo()
      //     .then(e => {
      //       console.log(e);
      //     })
      //     .catch(e => console.log("ERROR: " + e));
    }
    initEvents();
  }
  //   static loadVideos() {
  //     for (var key in videos) {
  //       if (videos.hasOwnProperty(key)) {
  //         var args = $.extend({}, videoOptions, videos[key]);
  //         args.playerVars.controls = args.controls;
  //         videoPlayers[key] = new YT.Player(key, args);
  //       }
  //     }
  //     initEvents();
  //     youtubeLoaded = true;
  //   }
}
export default SlideshowVideo;
function initEvents() {
  $(document).on("play", () => {
    console.log("SOMETHING IS PLAYING");
  });
  //   $(document).on("click.videoPlayer", "." + classes.playVideoBtn, function(
  //     evt
  //   ) {
  //     var playerId = $(evt.currentTarget).data("controls");
  //     startVideoOnClick(playerId);
  //   });

  //   $(document).on("click.videoPlayer", "." + classes.closeVideoBtn, function(
  //     evt
  //   ) {
  //     var playerId = $(evt.currentTarget).data("controls");
  //     closeVideo(playerId);
  //   });

  // Listen to resize to keep a background-size:cover-like layout
  $(window).on(
    "resize.videoPlayer",
    debounce(function() {
      //   if (youtubeLoaded) {
      //     sizeBackgroundVideos();
      //   }
    }, 250)
  );
}

function removeEvents() {
  $(document).off(".videoPlayer");
  $(window).off(".videoPlayer");
}
function onPlayerReady(evt) {
  evt.target.setPlaybackQuality("hd1080");
  var videoData = getVideoOptions(evt);

  playOnClickCheck();

  // Prevent tabbing through YouTube player controls until visible
  $("#" + videoData.id).attr("tabindex", "-1");

  sizeBackgroundVideos();

  // Customize based on options from the video ID
  switch (videoData.type) {
    case "background-chrome":
    case "background":
      evt.target.mute();
      // Only play the video if it is in the active slide
      if (videoData.$parentSlide.hasClass(classes.currentSlide)) {
        privatePlayVideo(videoData.id);
      }
      break;
  }

  videoData.$parentSlide.addClass(classes.loaded);
}

function customPlayVideo(playerId) {
  // Do not autoplay just because the slideshow asked you to.
  // If the slideshow asks to play a video, make sure
  // we have done the playOnClick check first
  if (!playOnClickChecked && !playOnClick) {
    return;
  }

  if (playerId && typeof videoPlayers[playerId].playVideo === "function") {
    privatePlayVideo(playerId);
  }
}

function pauseVideo(playerId) {
  if (
    videoPlayers[playerId] &&
    typeof videoPlayers[playerId].pauseVideo === "function"
  ) {
    videoPlayers[playerId].pauseVideo();
  }
}

//   /**
//    * Private functions
//    */

function privatePlayVideo(id, clicked) {
  var videoData = videos[id];
  var player = videoPlayers[id];
  var $slide = videos[id].$parentSlide;

  if (playOnClick) {
    // playOnClick means we are probably on mobile (no autoplay).
    // setAsPlaying will show the iframe, requiring another click
    // to play the video.
    setAsPlaying(videoData);
  } else if (clicked || (autoplayCheckComplete && autoplayAvailable)) {
    // Play if autoplay is available or clicked to play
    $slide.removeClass(classes.loading);
    setAsPlaying(videoData);
    player.playVideo();
    return;
  }

  // Check for autoplay if not already done
  if (!autoplayCheckComplete) {
    autoplayCheckFunction(player, $slide);
  }
}

function setAutoplaySupport(supported) {
  var supportClass = supported
    ? classes.supportsAutoplay
    : classes.supportsNoAutoplay;
  $(document.documentElement).addClass(supportClass);

  if (!supported) {
    playOnClick = true;
  }

  autoplayCheckComplete = true;
}

//   function autoplayCheckFunction(player, $slide) {
//     // attempt to play video
//     player.playVideo();

//     autoplayTest(player)
//       .then(function() {
//         setAutoplaySupport(true);
//       })
//       .fail(function() {
//         // No autoplay available (or took too long to start playing).
//         // Show fallback image. Stop video for safety.
//         setAutoplaySupport(false);
//         player.stopVideo();
//       })
//       .always(function() {
//         autoplayCheckComplete = true;
//         $slide.removeClass(classes.loading);
//       });
//   }

//   function autoplayTest(player) {
//     var deferred = $.Deferred();
//     var wait;
//     var timeout;

//     wait = setInterval(function() {
//       if (player.getCurrentTime() <= 0) {
//         return;
//       }

//       autoplayAvailable = true;
//       clearInterval(wait);
//       clearTimeout(timeout);
//       deferred.resolve();
//     }, 500);

//     timeout = setTimeout(function() {
//       clearInterval(wait);
//       deferred.reject();
//     }, 4000); // subjective. test up to 8 times over 4 seconds

//     return deferred;
//   }

function playOnClickCheck() {
  // Bail early for a few instances:
  // - small screen
  // - device sniff mobile browser

  if (playOnClickChecked) {
    return;
  }

  if ($(window).width() < 750) {
    playOnClick = true;
  } else if (window.mobileCheck()) {
    playOnClick = true;
  }

  if (playOnClick) {
    // No need to also do the autoplay check
    setAutoplaySupport(false);
  }

  playOnClickChecked = true;
}

//   // The API will call this function when each video player is ready

function onPlayerChange(evt) {
  var videoData = getVideoOptions(evt);

  switch (evt.data) {
    case 0: // ended
      setAsFinished(videoData);
      break;
    case 1: // playing
      setAsPlaying(videoData);
      break;
    case 2: // paused
      setAsPaused(videoData);
      break;
  }
}

function setAsFinished(videoData) {
  switch (videoData.type) {
    case "background":
      videoPlayers[videoData.id].seekTo(0);
      break;
    case "background-chrome":
      videoPlayers[videoData.id].seekTo(0);
      closeVideo(videoData.id);
      break;
    case "chrome":
      closeVideo(videoData.id);
      break;
  }
}

function setAsPlaying(videoData) {
  var $slideshow = videoData.$parentSlideshowWrapper;
  var $slide = videoData.$parentSlide;

  $slide.removeClass(classes.loading);

  // Do not change element visibility if it is a background video
  if (videoData.status === "background") {
    return;
  }

  $("#" + videoData.id).attr("tabindex", "0");

  switch (videoData.type) {
    case "chrome":
    case "background-chrome":
      $slideshow.removeClass(classes.paused).addClass(classes.playing);
      $slide.removeClass(classes.paused).addClass(classes.playing);
      break;
  }

  // Update focus to the close button so we stay within the slide
  $slide.find("." + classes.closeVideoBtn).focus();
}

function setAsPaused(videoData) {
  var $slideshow = videoData.$parentSlideshowWrapper;
  var $slide = videoData.$parentSlide;

  if (videoData.type === "background-chrome") {
    closeVideo(videoData.id);
    return;
  }

  // YT's events fire after our click event. This status flag ensures
  // we don't interact with a closed or background video.
  if (videoData.status !== "closed" && videoData.type !== "background") {
    $slideshow.addClass(classes.paused);
    $slide.addClass(classes.paused);
  }

  if (videoData.type === "chrome" && videoData.status === "closed") {
    $slideshow.removeClass(classes.paused);
    $slide.removeClass(classes.paused);
  }

  $slideshow.removeClass(classes.playing);
  $slide.removeClass(classes.playing);
}

function closeVideo(playerId) {
  var videoData = videos[playerId];
  var $slideshow = videoData.$parentSlideshowWrapper;
  var $slide = videoData.$parentSlide;
  var classesToRemove = [classes.pause, classes.playing].join(" ");

  $("#" + videoData.id).attr("tabindex", "-1");

  videoData.status = "closed";

  switch (videoData.type) {
    case "background-chrome":
      videoPlayers[playerId].mute();
      setBackgroundVideo(playerId);
      break;
    case "chrome":
      videoPlayers[playerId].stopVideo();
      setAsPaused(videoData); // in case the video is already paused
      break;
  }

  $slideshow.removeClass(classesToRemove);
  $slide.removeClass(classesToRemove);
}

function getVideoOptions(evt) {
  return videos[evt.target.h.id];
}

function startVideoOnClick(playerId) {
  var videoData = videos[playerId];
  // add loading class to slide
  videoData.$parentSlide.addClass(classes.loading);

  videoData.status = "open";

  switch (videoData.type) {
    case "background-chrome":
      unsetBackgroundVideo(playerId, videoData);
      videoPlayers[playerId].unMute();
      privatePlayVideo(playerId, true);
      break;
    case "chrome":
      privatePlayVideo(playerId, true);
      break;
  }

  // esc to close video player
  $(document).on("keydown.videoPlayer", function(evt) {
    if (evt.keyCode === 27) {
      closeVideo(playerId);
    }
  });
}

function sizeBackgroundVideos() {
  $("." + classes.videoBackground).each(function(index, el) {
    sizeBackgroundVideo($(el));
  });
}

function sizeBackgroundVideo($player) {
  var $slide = $player.closest("." + classes.slide);
  // Ignore cloned slides
  if ($slide.hasClass(classes.slickClone)) {
    return;
  }
  var slideWidth = $slide.width();
  var playerWidth = $player.width();
  var playerHeight = $player.height();

  // when screen aspect ratio differs from video, video must center and underlay one dimension
  if (slideWidth / videoOptions.ratio < playerHeight) {
    playerWidth = Math.ceil(playerHeight * videoOptions.ratio); // get new player width
    $player
      .width(playerWidth)
      .height(playerHeight)
      .css({
        left: (slideWidth - playerWidth) / 2,
        top: 0
      }); // player width is greater, offset left; reset top
  } else {
    // new video width < window width (gap to right)
    playerHeight = Math.ceil(slideWidth / videoOptions.ratio); // get new player height
    $player
      .width(slideWidth)
      .height(playerHeight)
      .css({
        left: 0,
        top: (playerHeight - playerHeight) / 2
      }); // player height is greater, offset top; reset left
  }

  $player.prepareTransition().addClass(classes.loaded);
}

function unsetBackgroundVideo(playerId) {
  // Switch the background-chrome to a chrome-only player once played
  $("#" + playerId)
    .removeAttr("style")
    .removeClass(classes.videoBackground)
    .addClass(classes.videoChrome);

  videos[playerId].$parentSlideshowWrapper
    .removeClass(classes.slideBackgroundVideo)
    .addClass(classes.playing);

  videos[playerId].$parentSlide
    .removeClass(classes.slideBackgroundVideo)
    .addClass(classes.playing);

  videos[playerId].status = "open";
}

function setBackgroundVideo(playerId) {
  // Switch back to background-chrome when closed
  var $player = $("#" + playerId)
    .addClass(classes.videoBackground)
    .removeClass(classes.videoChrome);

  videos[playerId].$parentSlide.addClass(classes.slideBackgroundVideo);

  videos[playerId].status = "background";
  sizeBackgroundVideo($player);
}

//   function removeEvents() {
//     $(document).off(".videoPlayer");
//     $(window).off(".videoPlayer");
//   }

//   return {
//     init: init,
//     loadVideos: loadVideos,
//     loadVideo: loadVideo,
//     playVideo: customPlayVideo,
//     pauseVideo: pauseVideo,
//     removeEvents: removeEvents
//   };
// })();

function debounce(func, wait, immediate) {
  var timeout;

  // This is the function that is actually executed when
  // the DOM event is triggered.
  return function executedFunction() {
    // Store the context of this and any
    // parameters passed to executedFunction
    var context = this;
    var args = arguments;

    // The function to be called after
    // the debounce time has elapsed
    var later = function() {
      // null timeout to indicate the debounce ended
      timeout = null;

      // Call function now if you did not on the leading end
      if (!immediate) func.apply(context, args);
    };

    // Determine if you should call the function
    // on the leading or trail end
    var callNow = immediate && !timeout;

    // This will reset the waiting every function execution.
    // This is the step that prevents the function from
    // being executed because it will never reach the
    // inside of the previous setTimeout
    clearTimeout(timeout);

    // Restart the debounce waiting period.
    // setTimeout returns a truthy value (it differs in web vs node)
    timeout = setTimeout(later, wait);

    // Call immediately if you're dong a leading
    // end execution
    if (callNow) func.apply(context, args);
  };
}
