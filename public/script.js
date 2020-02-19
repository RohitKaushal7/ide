form = document.querySelector("form");
submit = document.querySelector("#comp");
clr = document.querySelector("#clear");
bar = document.querySelector(".bar");

form.addEventListener("submit", ev => {
  ev.preventDefault();
  // let code = document.querySelector("#code");
  let inp = document.querySelector("#inp");
  let out = document.querySelector("#out");
  bar.style.width = "50%";
  bar.classList.remove("rr");
  bar.classList.remove("gg");
  bar.classList.add("yy");

  ed_code = editor.getValue();
  // console.log(ed_code);

  data = {
    code: ed_code,
    inp: inp.value,
    out: out.value
  };

  fetch("/compile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(data => {
      if (data.status == 200) {
        out.value = data.out;
        out.classList.remove("yellow");
        out.classList.remove("red");
        bar.style.width = "100%";
        bar.classList.remove("rr");
        bar.classList.add("gg");
      } else if (data.out.indexOf("Command failed") != -1) {
        out.value = "Time Limit Exceeded 5 seconds.";
        out.classList.add("yellow");
        bar.style.width = "100%";
        bar.classList.remove("gg");
        bar.classList.remove("rr");
        bar.classList.add("yy");
      } else {
        out.value = data.out;
        out.classList.remove("yellow");
        out.classList.add("red");
        bar.style.width = "100%";
        bar.classList.remove("gg");
        bar.classList.add("rr");
      }
    });
});
