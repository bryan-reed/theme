window.lazySizesConfig = window.lazySizesConfig || {};
window.lazySizesConfig.customMedia = {
  "--small": "(max-width: 480px)",
  "--medium": "(max-width: 900px)",
  "--large": "(max-width: 1400px)"
};
import "lazysizes/plugins/object-fit/ls.object-fit";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import "lazysizes/plugins/rias/ls.rias";
import "lazysizes/plugins/bgset/ls.bgset";
import "lazysizes";
import "lazysizes/plugins/respimg/ls.respimg";

import "../../styles/theme.scss";

import "../../styles/theme2.scss.liquid";

import $ from "jquery";
import { pageLinkFocus } from "@shopify/theme-a11y";
import { cookiesEnabled } from "@shopify/theme-cart";
import { wrapTable, wrapIframe } from "@shopify/theme-rte";

import mobileNav from "../sections/mobile_nav";
import StickyNav from "../sections/sticky_nav";

window.slate = window.slate || {};
window.theme = window.theme || {};

$(document).ready(() => {
  const mobile_nav = new mobileNav();
  const sticky_nav = new StickyNav();
  // Common a11y fixes
  if (window.location.hash !== "#") {
    pageLinkFocus($(window.location.hash));
  }

  $(".in-page-link").on("click", evt => {
    pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  const tableSelectors = ".rte table";

  wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: "rte__table-wrapper"
  });

  // Target iframes to make them responsive
  const iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: "rte__video-wrapper"
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace(
      "supports-no-cookies",
      "supports-cookies"
    );
  }
});
