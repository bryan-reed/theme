import "../../styles/password.scss";
import $ from "jquery";
$(document).ready(() => {
  let passwordTrigger = ".password-form-trigger";
  let passwordFrom = ".password-form";
  let formOpen = false;
  $(passwordTrigger).click(showPasswordForm);
  //   passwordTrigger.addEventListener("click", showPasswordForm);

  function showPasswordForm(e) {
    if (!formOpen) {
      $(passwordFrom).addClass("open");
      $(passwordTrigger).addClass("open");
    } else {
      $(passwordFrom).removeClass("open");
      $(passwordTrigger).removeClass("open");
    }
    formOpen = !formOpen;
  }
});
