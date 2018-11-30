import $ from "jquery";
import flexslider from "flexslider";
import slick from "slick-carousel";
import sections from "@shopify/theme-sections";

sections.register("page-four", {
    onLoad(e) {
        // Get the element

        // this.slideshow();
        this.carousel();
    },
    carousel() {
        this.elementSlick = this.$container.find(".slicker");
        this.startCarousel();
    },
    slideshow() {
        this.elementSlideshow = this.$container.find(".slider");
        this.duration = $(this.elementSlideshow).data("duration");
        this.slides = this.$container.find("li.iterable-slides");
        this.startSlideshow();
    },
    startSlideshow() {
        let that = this;
        $(this.elementSlideshow).flexslider({
            animation: "slide",
            controlNav: false,
            slideshowSpeed: that.duration,
            // smoothHeight: true,
            start: function () {
                window.dispatchEvent(new Event("resize")); //trigger resize when flexslider is loaded, fixes bug where part of second slide shows
            }
        });
    },
    startCarousel() {
        let that = this;
        $(this.elementSlick).slick({
            slidesToScroll: 1,
            responsive: [{
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
        console.log("SECTION SELECTED   ssss", e);
    },
    onBlockSelect(e) {
        //Have to handle this differently
        // // console.log("BLOCK SELECTED", e);
        // let blockId = e.detail.blockId;
        // //Get index
        // let $slide = $(".flex-slide-" + blockId + ":not(.clone)");
        // let index = $slide.data("slide-index");
        // $(this.element).flexslider(index);
        // $(this.element).flexslider("pause");
    },
    onBlockDeselect(e) {
        // console.log("BLOCK DESELECTED", e);
        // $(this.element).flexslider("play");
    },
    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload(e) {
        // console.log("SECTION UNLOADED", e, this);
        this.$container.off(this.namespace);
    }
});