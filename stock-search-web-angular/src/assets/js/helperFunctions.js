  headerLinkStyle = function headerLinkStyle(idName) {
    var linkList = document.querySelectorAll(".nav-item");

    for (let i = 0; i < linkList.length; i++) {
      var cur_list = linkList[i];

      if (cur_list.id === idName) {
        cur_list.classList.add("active");
        cur_list.classList.add("border");
      } else {
        cur_list.classList.remove("active");
        cur_list.classList.remove("border");
      }

    }
  }

