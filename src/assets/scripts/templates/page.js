import "../sections/page-one";
import "../sections/page-two";
import "../sections/page-contact";

import $ from "jquery";
import sections from "@shopify/theme-sections";

$(document).ready(() => {
  sections.load(["page-one", "page-two", "page-contact"]);
});
