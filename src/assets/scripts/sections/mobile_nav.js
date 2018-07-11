import $ from "jquery";
class mobileNav {
  constructor() {
    //Selectors
    this.openMenuTrigger = ".main-header__mobile-trigger";
    this.closeMenuTrigger = ".mobile-nav-close";
    this.menuContainer = ".main-nav";
    this.menuBackground = ".mobile-nav-background";
    this.dropdownsLeft = ".layout-left .mega-menu>a, .layout-left .dropdown>a";
    this.dropdownsDown = ".layout-down .mega-menu>a, .layout-down .dropdown>a";
    this.backBtn = ".side-back";
    this.appended = ".appended-remove";

    //Start listening for events
    this.events();
  }
  events() {
    $(document).on("click", this.openMenuTrigger, this.openMenu.bind(this));
    $(document).on("click", this.closeMenuTrigger, this.closeMenu.bind(this));
    $(document).on(
      "click",
      this.dropdownsLeft,
      this.toggleSubNavLeft.bind(this)
    );
    $(document).on(
      "click",
      this.dropdownsDown,
      this.toggleSubNavDown.bind(this)
    );
    $(document).on("click", this.backBtn, this.toggleBackNav.bind(this));
    // this.openMenuTrigger.click(this.openMenu.bind(this));
    // this.closeMenuTrigger.click(this.closeMenu.bind(this));
  }
  //   Open the mobile menu
  openMenu() {
    $(this.openMenuTrigger).toggleClass("mobile-open");
    if (!$(this.openMenuTrigger).hasClass("mobile-open")) {
      $(".main-nav__top").removeClass("sub-open");
      $(".main-nav__top li").removeClass("open");
      $(this.appended).remove();
    }
    $(document)
      .find(this.menuContainer)
      .toggleClass("mobile-open");
    $(document)
      .find(this.closeMenuTrigger)
      .addClass("mobile-open");
    //Add close button only to left layout
    if ($(".main-nav.layout-left").length) {
      $(".main-nav ul").append('<li class="mobile-nav-close">&#10005;</li>');
    }
    // this.toggle.toggleClass("mobile-open");
    // $(document)
    //   .find(this.menuBackground)
    //   .addClass("mobile-open");
  }
  //Close the mobile menu
  closeMenu() {
    $(this.openMenuTrigger).removeClass("mobile-open");
    $(document)
      .find(this.menuContainer)
      .removeClass("mobile-open");
    $(this.closeMenuTrigger).remove();
    //   $(document)
    //     .find(this.menuBackground)
    //     .removeClass("mobile-open");
    //   $(document)
    //     .find(this.closeMenuTrigger)
    //     .removeClass("mobile-open");
  }
  toggleBackNav(e) {
    e.preventDefault();
    $(e.target)
      .closest("li.open")
      .removeClass("open");
    $(e.target)
      .closest(".sub-open")
      .removeClass("sub-open");
    $(this.appended).remove();
  }
  toggleSubNavDown(e) {
    e.preventDefault();
    //Toggle class on target
    if (
      $(e.target)
        .parent("li")
        .find(".mega-menu__container").length
    ) {
      let str =
        '<div class="mega-menu__container__col appended-remove"><div class="mega-menu__container__col__text"><a class="column_header side-back" href="">&lt; Back</a></div></div>';
      $(e.target)
        .parent("li")
        .find(".mega-menu__container")
        .prepend(str);
    } else {
      $(e.target)
        .parent("li")
        .find("ul")
        .prepend(
          '<li class="side-back appended-remove"><a href="">&lt; Back</a></li>'
        );
    }
    $(e.target)
      .parent("li")
      .toggleClass("open");
    $(e.target)
      .parent("li")
      .parent("ul")
      .toggleClass("sub-open");
  }
  toggleSubNavLeft(e) {
    e.preventDefault();
    //Toggle class on target
    $(e.target)
      .parent("li")
      .toggleClass("open");
    $(e.target)
      .parent("li")
      .parent("ul")
      .toggleClass("sub-open");
  }
}
export default mobileNav;
