const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#updateForm [type=submit]")
      updateBtn.removeAttribute("disabled")
    })