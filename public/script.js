Compile = document.querySelector("#Compile");
clr = document.querySelector("#Clear");
bar = document.querySelector(".inner");
let inp = document.querySelector("#inp");
let out = document.querySelector("#out");

lang = "cpp";
function change() {
  lang = document.querySelector("#lang").value;
  load();
}

clr.addEventListener("click", e => {
  inp.value = "";
  out.value = "";
});

Compile.addEventListener("click", ev => {
  ev.preventDefault();
  // let code = document.querySelector("#code");
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

  fetch("/" + lang, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(data => {
      console.log(data.out);

      if (data.status == 200) {
        out.value = data.out;
        out.classList.remove("yellow");
        out.classList.remove("red");
        bar.style.width = "100%";
        bar.classList.remove("rr");
        bar.classList.add("gg");
      } else if (data.out.indexOf("tle") != -1) {
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
    })
    .catch(e => {
      console.log(e.message);
      out.value = "Failed to Connect to server.. :(";
      out.classList.add("red");
    });
});
