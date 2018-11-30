/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

import $ from "jquery";
import slick from "slick-carousel";
import Variants from "@shopify/theme-variants";
import {
  formatMoney
} from "@shopify/theme-currency";
import sections from "@shopify/theme-sections";
import stickySidebar from "sticky-sidebar";

const selectors = {
  addToCart: "[data-add-to-cart]",
  addToCartText: "[data-add-to-cart-text]",
  comparePrice: "[data-compare-price]",
  comparePriceText: "[data-compare-text]",
  originalSelectorId: "[data-product-select]",
  priceWrapper: "[data-price-wrapper]",
  productImageWrapper: "[data-product-image-wrapper]",
  productFeaturedImage: "[data-product-featured-image]",
  productJson: "[data-product-json]",
  productPrice: "[data-product-price]",
  productThumbs: "[data-product-single-thumbnail]",
  singleOptionSelector: "[data-single-option-selector]"
};

const cssClasses = {
  activeThumbnail: "active-thumbnail",
  hide: "hide"
};

/**
 * Product section constructor. Runs on page load as well as Theme Editor
 * `section:load` events.
 * @param {string} container - selector for the section container DOM element
 */
sections.register("product", {
  onLoad() {
    console.log(this.$container.data('layout'));
    const layoutTemplate = this.$container.data('layout');
    // console.log(productTemplate, 'is the template');
    if (layoutTemplate == 'layout-2') {
      this.handleScroll();
    } else {
      // console.log("Hello from product js");
      let opts = {};
      let slickSelector = "";
      let numSlides = $(".detail_image").length;
      if ($(".alt_images").length) {
        slickSelector = ".alt_images";
        opts = {
          slidesToScroll: 1,
          slidesToShow: 3
        };
      } else {
        slickSelector = ".product__alt_images";
        opts = {
          dots: false,
          infinite: false,
          vertical: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          verticalSwiping: true,
          lazyLoad: 'ondemand',
          prevArrow: '<button class="slick-prev"><span>&#10094;</span></button>',
          nextArrow: '<button class="slick-next"><span>&#10095;</span></button>'
        };
      }
      //Only initialize slider if more than 3 images
      if (numSlides > 3) {
        $(slickSelector).slick(opts);
      }
    }


    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    this.productSingleObject = JSON.parse(
      $(selectors.productJson, this.$container).html()
    );

    const options = {
      $container: this.$container,
      enableHistoryState: this.$container.data("enable-history-state") || false,
      singleOptionSelector: selectors.singleOptionSelector,
      originalSelectorId: selectors.originalSelectorId,
      product: this.productSingleObject
    };

    this.settings = {};
    this.variants = new Variants(options);
    this.$featuredImage = $(selectors.productFeaturedImage, this.$container);

    this.$container.on(
      `variantChange${this.namespace}`,
      this.updateAddToCartState.bind(this)
    );
    this.$container.on(
      `variantPriceChange${this.namespace}`,
      this.updateProductPrices.bind(this)
    );

    if (this.$featuredImage.length > 0) {
      this.$container.on(
        `variantImageChange${this.namespace}`,
        this.updateImages.bind(this)
      );
    }
  },
  handleScroll() {
    var sidebar = new StickySidebar(".product-page__right", {
      topSpacing: 80,
      bottomSpacing: 20,
      containerSelector: ".product-page",
      innerWrapperSelector: ".inner"
    });
  },
  setActiveThumbnail(imageId) {
    let newImageId = imageId;

    // If "imageId" is not defined in the function parameter, find it by the current product image
    if (typeof newImageId === "undefined") {
      newImageId = $(
        `${selectors.productImageWrapper}:not('.${cssClasses.hide}')`
      ).data("image-id");
    }

    const $thumbnail = $(
      `${selectors.productThumbs}[data-thumbnail-id='${newImageId}']`
    );

    $(selectors.productThumbs)
      .removeClass(cssClasses.activeThumbnail)
      .removeAttr("aria-current");

    $thumbnail.addClass(cssClasses.activeThumbnail);
    $thumbnail.attr("aria-current", true);
  },

  switchImage(imageId) {
    const $newImage = $(
      `${selectors.productImageWrapper}[data-image-id='${imageId}']`,
      this.$container
    );
    const $otherImages = $(
      `${selectors.productImageWrapper}:not([data-image-id='${imageId}'])`,
      this.$container
    );
    $newImage.removeClass(cssClasses.hide);
    $otherImages.addClass(cssClasses.hide);
  },

  /**
   * Updates the DOM state of the add to cart button
   *
   * @param {boolean} enabled - Decides whether cart is enabled or disabled
   * @param {string} text - Updates the text notification content of the cart
   */
  updateAddToCartState(evt) {
    const variant = evt.variant;

    if (variant) {
      $(selectors.priceWrapper, this.$container).removeClass(cssClasses.hide);
    } else {
      $(selectors.addToCart, this.$container).prop("disabled", true);
      $(selectors.addToCartText, this.$container).html(
        theme.strings.unavailable
      );
      $(selectors.priceWrapper, this.$container).addClass(cssClasses.hide);
      return;
    }

    if (variant.available) {
      $(selectors.addToCart, this.$container).prop("disabled", false);
      $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
    } else {
      $(selectors.addToCart, this.$container).prop("disabled", true);
      $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
    }
  },

  updateImages(evt) {
    const variant = evt.variant;
    const imageId = variant.featured_image.id;

    this.switchImage(imageId);
    this.setActiveThumbnail(imageId);
  },

  /**
   * Updates the DOM with specified prices
   *
   * @param {string} productPrice - The current price of the product
   * @param {string} comparePrice - The original price of the product
   */
  updateProductPrices(evt) {
    const variant = evt.variant;
    const $comparePrice = $(selectors.comparePrice, this.$container);
    const $compareEls = $comparePrice.add(
      selectors.comparePriceText,
      this.$container
    );

    $(selectors.productPrice, this.$container).html(
      formatMoney(variant.price, theme.moneyFormat)
    );

    if (variant.compare_at_price > variant.price) {
      $comparePrice.html(
        formatMoney(variant.compare_at_price, theme.moneyFormat)
      );
      $compareEls.removeClass(cssClasses.hide);
    } else {
      $comparePrice.html("");
      $compareEls.addClass(cssClasses.hide);
    }
  },

  /**
   * Event callback for Theme Editor `section:unload` event
   */
  onUnload() {
    this.$container.off(this.namespace);
  }
});