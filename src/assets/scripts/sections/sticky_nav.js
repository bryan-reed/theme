import $ from "jquery";
// import ScrollOut from "scroll-out";
class StickyNav {
  constructor() {
    //Selectors
    this.navBar = $(".navigation");
    this.stickyClass = "sticky";
    this.headerHeight = $("#shopify-section-header").height();
    this.navBarHeight = $(".navigation").height();
    this.currentScrollTop = 0;
    this.events();
    // console.log(waypoints);
    // this.openMenuTrigger = ".main-header__mobile-trigger";
    // this.closeMenuTrigger = ".mobile-nav-close";
    // this.menuContainer = ".main-nav";
    // this.menuBackground = ".mobile-nav-background";
    // this.dropdownsLeft = ".layout-left .mega-menu>a, .layout-left .dropdown>a";
    // this.dropdownsDown = ".layout-down .mega-menu>a, .layout-down .dropdown>a";
    // this.backBtn = ".side-back";
    // this.appended = ".appended-remove";
    //Start listening for events
    // this.events();
  }
  events() {
    $(window).scroll(this.handleStickyNav.bind(this));
  }
  handleStickyNav(e) {
    let scrollTop = $(window).scrollTop();
    if (scrollTop > this.headerHeight + this.navBarHeight) {
      this.navBar.addClass(this.stickyClass);
    } else if (scrollTop < this.headerHeight) {
      this.navBar.removeClass(this.stickyClass);
    }
  }
}
export default StickyNav;
