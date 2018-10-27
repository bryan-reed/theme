import "../sections/product";
import "../sections/slideshow";
import "../sections/featured-collection";
import "../sections/map";

import $ from "jquery";
import sections from "@shopify/theme-sections";
$(document).ready(() => {
  sections.load(["product", "slideshow-section", "featured-collection", "map"]);
});
