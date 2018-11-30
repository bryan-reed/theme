import "../sections/collection-template";

import $ from "jquery";
import sections from "@shopify/theme-sections";
$(document).ready(() => {
  sections.load(["collection-template"]);
});
