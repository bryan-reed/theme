import "../sections/page-one";
import "../sections/page-two";
import "../sections/page-three";
import "../sections/page-four";
import "../sections/page-five";
import "../sections/page-contact";

import $ from "jquery";
import sections from "@shopify/theme-sections";

$(document).ready(() => {
  sections.load(["page-one", "page-two", "page-three", "page-four", "page-five", "page-contact"]);
});