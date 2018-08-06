import $ from "jquery";
import flexslider from "flexslider";
import sections from "@shopify/theme-sections";

sections.register("slideshow", {
  onLoad(e) {
    console.log("SLIDESHOW LOADED");
    // console.log("SECTION LOADED", e, this);
    // Get the element
    this.element = this.$container.find(".slider");
    this.duration = $(this.element).data("duration");
    this.slides = this.$container.find("li.iterable-slides");
    this.startSlideshow();
  },
  startSlideshow() {
    let that = this;
    $(this.element).flexslider({
      animation: "slide",
      controlNav: false,
      slideshowSpeed: that.duration,
      // smoothHeight: true,
      start: function() {
        window.dispatchEvent(new Event("resize")); //trigger resize when flexslider is loaded, fixes bug where part of second slide shows
      }
    });
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
