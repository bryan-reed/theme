import $ from "jquery";
// import flexslider from "flexslider";
import slick from "slick-carousel";
import sections from "@shopify/theme-sections";

sections.register("featured-collection", {
  onLoad(e) {
    // console.log("SECTION LOADED", e, this);
    // Get the element
    this.element = this.$container.find(".slicker");
    this.startCarousel();
  },
  startCarousel() {
    let that = this;
    $(this.element).slick({
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });
    // $(this.element).flexslider({
    //   animation: "slide",
    //   controlNav: false,
    //   itemWidth: 210,
    //   itemMargin: 5,
    //   start: function() {
    //     window.dispatchEvent(new Event("resize")); //trigger resize when flexslider is loaded, fixes bug where part of second slide shows
    //   }
    // });
  },
  onSelect(e) {
    // console.log("SECTION SELECTED", e);
  },
  onBlockSelect(e) {
    // console.log("BLOCK SELECTED", e);
    let blockId = e.detail.blockId;
    //Get index
    let $slide = $(".flex-slide-" + blockId + ":not(.clone)");
    let index = $slide.data("slide-index");
    $(this.element).flexslider(index);
    $(this.element).flexslider("pause");
  },
  onBlockDeselect(e) {
    // console.log("BLOCK DESELECTED", e);
    $(this.element).flexslider("play");
  },
  /**
   * Event callback for Theme Editor `section:unload` event
   */
  onUnload(e) {
    // console.log("SECTION UNLOADED", e, this);
    this.$container.off(this.namespace);
  }
});
