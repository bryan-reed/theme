import $ from "jquery";
import Variants from "@shopify/theme-variants";
import slick from "slick-carousel";
import _ from "lodash-es";
import sections from "@shopify/theme-sections";
import { formatMoney } from "@shopify/theme-currency";

// const selectors = {
//   store: "puppielove.com"
// };

const selectors = {
  sidebarLinks: ".collection__navigation li.top-lvl",
  quickViewTrigger: ".quick_view_link",
  quickViewContainer: ".collection__quickview",
  quickViewClose: ".close",
  quickViewAltImages: ".alt_images img",
  quickViewMainImage: ".main_image img",
  filterCheckBoxes: '[name="filter_by[]"]',
  variantOption1: ".variant_option1",
  variantOption2: ".variant_option2",
  variantOption3: ".variant_option3"
  // singleOptionSelector: "[data-single-option-selector]",
  // originalSelectorId: "[data-product-select]"
};
sections.register("collection-template", {
  onLoad(e) {
    this.currentProduct = {};
    this.currentVariant = {};
    this.selectedVariant;
    this.quickViewSettings = {
      vendor: $(selectors.quickViewContainer).data("vendor"),
      option1: $(selectors.quickViewContainer).data("option1"),
      option2: $(selectors.quickViewContainer).data("option2"),
      option3: $(selectors.quickViewContainer).data("option3"),
      swatchStyle: $(selectors.quickViewContainer).data("swatch-style")
    };
    this.currentURL = this.$container.data("url");
    this.currentFilters = [];

    // const options = {
    //   $container: this.$container,
    //   enableHistoryState: false,
    //   singleOptionSelector: selectors.singleOptionSelector,
    //   originalSelectorId: selectors.originalSelectorId,
    //   product: this.productSingleObject
    // };
    // this.variants = new Variants(options);
    // this.collection = this.$container.data("collection");
    // this.collection = "adult";
    // this.products = [];
    // this.page = 1;
    //Turned off
    // this.loadCollection().done(this.loadAllProducts.bind(this));
    this.loadFilters();
    this.events();
  },
  loadFilters() {
    let parts = window.location.href.split("/");
    let filts = parts[parts.length - 1].split("+");
    let that = this;
    $(selectors.filterCheckBoxes).each(function(index, el) {
      if (el.checked) {
        that.currentFilters.push(el.value.trim());
      }
    });
  },
  variantChanged(e) {
    const variant = e.variant;
    if (variant) {
      // $(selectors.priceWrapper, this.$container).removeClass(cssClasses.hide);
      $(".add_to_cart").show();
    } else {
      $(".add_to_cart").hide();
      return;
    }

    if (variant.available) {
      $(".add_to_cart", this.$container).prop("disabled", false);
      $(".add_to_cart", this.$container).html(theme.strings.addToCart);
      this.selectedVariant = variant;
    } else {
      $(".add_to_cart", this.$container).prop("disabled", true);
      $(".add_to_cart", this.$container).html(theme.strings.soldOut);
    }
  },
  imageChanged(e) {
    console.log("Image changed", e);
  },
  priceChanged(e) {
    //Update the price of the modal
    $("[data-price]", this.$container).html(
      formatMoney(e.variant.price, theme.moneyFormat)
    );
  },
  events() {
    this.$container.on(
      `variantChange${this.namespace}`,
      this.variantChanged.bind(this)
    );
    this.$container.on(
      `variantPriceChange${this.namespace}`,
      this.priceChanged.bind(this)
    );

    this.$container.on(
      `variantImageChange${this.namespace}`,
      this.imageChanged.bind(this)
    );

    $(selectors.quickViewContainer).on(
      "click",
      ".add_to_cart",
      this.addVariantToCart.bind(this)
    );
    //Open sidebar navigation items
    this.$container.on(
      "click",
      ".collection__navigation li.top-lvl",
      this.openSideNav.bind(this)
    );
    //Open quick view
    this.$container.on(
      "click",
      selectors.quickViewTrigger,
      this.launchQuickView.bind(this)
    );
    $(selectors.quickViewContainer).on(
      "click",
      selectors.quickViewClose,
      this.closeQuickView.bind(this)
    );
    $(selectors.quickViewContainer).on(
      "mouseover click",
      selectors.quickViewAltImages,
      this.changeMainImage.bind(this)
    );
    $(selectors.filterCheckBoxes).change(this.filterCatalog.bind(this));
    // $(selectors.quickViewContainer).on(
    //   "change",
    //   [
    //     selectors.variantOption1,
    //     selectors.variantOption2,
    //     selectors.variantOption3
    //   ],
    //   this.updateVariant.bind(this)
    // );
  },
  addVariantToCart(e) {
    $.ajax({
      type: "POST",
      url: `/cart/add.js`,
      data: { id: this.currentVariant.id, quantity: 1 },
      dataType: "json"
    })
      .done(function(resp) {
        $(".add_to_cart").html(theme.strings.addedToCart);
        //IF successful, open cart drawer if there is a cart drawer
      })
      .fail(err => {
        console.log(err);
      });
  },
  updateVariant(e) {
    let option = $(e.target).data("option");
    let target = selectors["variantOption" + option];
    let value = $(target + ":checked").val();
    if ($(e.target).is("select")) {
      value = $(target + " option:selected").val();
    }
    // this.currentVariant.push(value);
    // console.log(this.currentVariant);
    this.currentVariant["option" + option] = value;
    let that = this;
    // make sure minimum necessary variant options are selected
    let selectedVariant = this.currentProduct.variants.filter((v, i) => {
      return _.isEqual(
        v.options.sort(),
        Object.values(that.currentVariant).sort()
      );
    });
    if (selectedVariant.length) {
      this.selectedVariant = selectedVariant[0];
      //Only enable button if it is available
      if (this.selectedVariant.available) {
        $(".add_to_cart").removeAttr("disabled");
        $(".add_to_cart").html("Add to bag");
      } else {
        $(".add_to_cart").html("Unavailable");
      }
    } else {
      $(".add_to_cart").attr("disabled", true);
    }
  },
  filterCatalog(e) {
    let checkboxes = $(selectors.filterCheckBoxes);

    let index = this.currentFilters.indexOf(e.target.value);

    if (index == -1 && e.target.checked) {
      this.currentFilters.push(e.target.value.trim());
    } else {
      this.currentFilters.splice(index, 1);
    }

    // if (this.currentFilters.length) {
    window.location.href =
      this.currentURL + "/" + this.currentFilters.join("+");
    // } else {
    // window.location.href = this.currentURL;
    // }
  },
  changeMainImage(e) {
    $(selectors.quickViewContainer)
      .find(selectors.quickViewMainImage)
      .attr("src", e.target.src);
  },
  closeQuickView() {
    // this.quickViewModal.removeClass("open");
    $(selectors.quickViewContainer).removeClass("open");
    $(".alt_images").slick("unslick");
  },
  launchQuickView(e) {
    //Load product
    let that = this;
    let handle = $(e.target).data("product");
    this.currentVariantId = $(e.target).data("variant");
    this.loadProduct(handle).done(this.openQuickView.bind(this));
  },
  loadProduct(handle) {
    return $.ajax({
      url: `/products/${handle}.js`,
      dataType: "json"
    });
  },
  openQuickView(product) {
    this.currentProduct = product; //Store current product
    this.currentVariant = product.variants
      .filter((i, e) => i.id === this.currentVariantId)
      .shift();
    let var1, var2, var3;
    $(selectors.quickViewContainer).toggleClass("open");
    let images = this.currentProduct.images
      .map(
        (img, index) =>
          '<div class="detail_image"><img src="' + img + '" /></div>'
      )
      .join("");
    let variants = this.currentProduct.variants
      .map(
        (v, index) =>
          `<option 
          ${!v.available ? 'disabled="disabled"' : ""}
          ${v.id == this.currentVariant.id ? "selected" : ""}
          value="${v.id}">${v.title}</option>`
      )
      .join("");
    let filters = "";
    for (let option of this.currentProduct.options) {
      filters += getFilterOptions(
        option,
        this.quickViewSettings["option" + option.position],
        this.quickViewSettings.swatchStyle,
        this.currentVariant
      );
    }
    // if (this.quickViewSettings.option1 == "dropdown") {
    //   var1 = variantOptionsDD(
    //     this.currentProduct.options[0].values,
    //     this.currentProduct.options[0].name
    //   );
    // } else if (this.quickViewSettings.option1 == "swatch") {
    //   var1 = variantOptionsSwatch(
    //     this.currentProduct.options[0].values,
    //     this.currentProduct.options[0].name,
    //     this.quickViewSettings.swatchStyle
    //   );
    // }
    // if (this.quickViewSettings.option2 == "dropdown") {
    //   var2 = variantOptionsDD(
    //     this.currentProduct.options[1].values,
    //     this.currentProduct.options[1].name
    //   );
    // } else if (this.quickViewSettings.option2 == "swatch") {
    //   var2 = variantOptionsSwatch(
    //     this.currentProduct.options[1].values,
    //     this.currentProduct.options[1].name,
    //     this.quickViewSettings.swatchStyle
    //   );
    // }
    let template = `
      <span class="close">&times;</span>
      <div class="main_image">
        <img src="${this.currentProduct.featured_image}" alt="${
      this.currentProduct.title
    }" />
      </div>
      <div class="alt_images">
        ${images}
      </div>
      <div class="main_content">
      <h4>${this.currentProduct.vendor}</h4>
      <h2>${this.currentProduct.title}</h2>
      <small data-price>${formatMoney(
        this.currentProduct.price,
        theme.moneyFormat
      )}</small>
      ${filters}
      <select name="id" class="no-js" data-product-select>${variants}</select>
      <div class="btn_container">
      <button class="add btn add_to_cart">${theme.strings.addToCart}</button>
      </div>
      </div>
     `;
    $(selectors.quickViewContainer).html(template);
    $(".alt_images").slick({
      dots: false,
      infinite: false,
      vertical: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      verticalSwiping: true,
      prevArrow: '<button class="slick-prev"><span>&#10094;</span></button>',
      nextArrow: '<button class="slick-next"><span>&#10095;</span></button>'
    });
    //Resize the slick carousel
    setTimeout(() => {
      $(".alt_images").slick("refresh");
    }, 250);
    //Set up variants
    const options = {
      $container: this.$container,
      enableHistoryState: false,
      singleOptionSelector: "[data-single-option-selector]",
      originalSelectorId: "[data-product-select]",
      product: product
    };
    this.variants = new Variants(options);
    // console.log(this.variants);
  },
  //Expand accordion
  openSideNav(e) {
    $(e.target).toggleClass("open");
  },
  //Loading information about collection
  loadCollection() {
    return $.ajax({
      url: `https://${selectors.store}/collections/${this.collection}.json`,
      dataType: "json"
    });
  },
  loadAllProducts(data, test) {
    this.numProducts = data.collection.products_count;
    let that = this;
    this.loadProducts().done(function() {
      console.log(that);
    });
  },
  loadProducts() {
    let that = this;
    if (this.products.length != this.numProducts) {
      return $
        .ajax({
          url: `https://${selectors.store}/collections/${
            this.collection
          }/products.json?limit=500&page=${this.page++}`,
          dataType: "json"
        })
        .done(function(resp) {
          if (resp.products.length) {
            that.products = that.products.concat(resp.products);
            that.loadProducts();
          }
        });
    } else {
      return false;
    }
  },
  onSelect(e) {
    // console.log("SECTION SELECTED", e);
  },
  onBlockSelect(e) {
    // console.log("BLOCK SELECTED", e);
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
// function variantOptionsSwatch(opts, variant, style) {
//   if (variant.toLowerCase() === "color") {
//     var optsSelector = opts
//       .map(
//         opt =>
//           `<label><input type="radio" value="${opt}" name="${variant}" /> <span class="swatch color${
//             style == "circle" ? " circle" : ""
//           }" style="background-color:${opt};"></label>`
//       )
//       .join("");
//   } else {
//     var optsSelector = opts
//       .map(
//         opt =>
//           `<label><input type="radio" value="${opt}" name="${variant}" /> <span class="${
//             style == "circle" ? " circle" : ""
//           } swatch">${opt}</span></label>`
//       )
//       .join("");
//   }

//   return optsSelector;
// }
// function variantOptionsDD(opts, variant) {
//   var optsSelector = opts
//     .map(opt => `<option value="${opt}"> ${opt}</option>`)
//     .join("");
//   let html = `<select name="${variant}"><option>Select a ${variant}</option>${optsSelector}</select>`;
//   return html;
// }
// function getVariantOptionQuickView(variantObj) {
//   let layout = variantObj.layout;
// }
function getFilterOptions(data, option, style, currentVariant) {
  let html = `<div class="clearfix">
        <p>Select ${data.name}</p>`;
  switch (option) {
    case "swatch":
      if (data.name.toLowerCase() === "color") {
        html += data.values
          .map(
            (opt, index) =>
              `<label>
              <input type="radio" 
              value="${opt}" 
              ${
                opt === currentVariant["option" + data.position]
                  ? " checked"
                  : ""
              }
              data-single-option-selector
              data-index="option${data.position}"
              data-option="${data.position}" 
              name="variant_option${data.position}" 
              class="variant_option${data.position}" /> 
              <span class="swatch color${style == "circle" ? " circle" : ""}" 
              style="background-color:${opt};"></span>
              </label>`
          )
          .join("");
      } else {
        html += data.values
          .map(
            (opt, index) =>
              `<label><input type="radio"
              value="${opt}" 
              ${
                opt === currentVariant["option" + data.position]
                  ? " checked"
                  : ""
              }
              data-option="${data.position}" 
              data-single-option-selector
              data-index="option${data.position}"
              name="variant_option${data.position}" 
              class="variant_option${data.position}" /> 
              <span class="${
                style == "circle" ? " circle" : ""
              } swatch">${opt}</span></label>`
          )
          .join("");
      }
      break;
    default:
    case "dropdown":
      html += `<select class="variant_option${data.position}" data-option="${
        data.position
      }"
      data-single-option-selector
      data-index="option${data.position}">`;
      html += `<option value="">Select a ${data.name}</option>`;
      html += data.values
        .map(
          (opt, index) =>
            `<option value="${opt}"${
              opt === currentVariant["option" + data.position]
                ? " selected"
                : ""
            }>${opt}</option>`
        )
        .join("");
      html += `</select>`;
      // var optsSelector = opts
      //   .map(opt => `<option value="${opt}"> ${opt}</option>`)
      //   .join("");
      // let html = `<select name="${variant}"><option>Select a ${variant}</option>${optsSelector}</select>`;
      break;
  }
  html += "</div>";
  return html;
}
