$(function() {
  do {
    name = prompt("Enter Your Name");
  } while (!name);

  soc.emit("new-user", name);

  $("#m").focus();

  $("form").submit(e => {
    e.preventDefault();
    if ($("#m").val()) {
      $("#messages").append(
        $("<li>").html(
          `<span class="user">You</span><span class="msg">${$("#m").val()}`
        )
      );
      soc.emit("msg", $("#m").val());
      $("#m").val("");
      document
        .querySelector("#messages")
        .scrollTo(0, document.querySelector("#messages").scrollHeight);
    }
  });

  $("#m").keydown(e => {
    if ($("#m").val()) {
      soc.emit("typing");
    } else {
      soc.emit("not-typing");
    }
    scrollToBottom();
  });

  // ------------ Online Users -------
  soc.on("all", users => {
    // console.log(users);
    online = "";
    for (user in users) {
      online += `<span class="badge"> ${users[user]}</span>`;
    }
    $(".online").html(online);
  });

  // ----- ON -------

  soc.on("typing", user => {
    $(`#${user}`).remove();
    $("#messages").append(
      $(`<li id="${user}" class="typing">`).html(
        `<span class="user">${user}</span><span class="msg">Typing...`
      )
    );
    scrollToBottom();
  });

  soc.on("not-typing", user => {
    $(`#${user}`).remove();
    scrollToBottom();
  });

  soc.on("msg", msg => {
    // console.log(msg);
    $(`#${msg.user}`).remove();
    $("#messages").append(
      $("<li>").html(
        `<span class="user">${msg.user}</span><span class="msg">${msg.msg}`
      )
    );
    scrollToBottom();
  });

  soc.on("new-user", user => {
    // console.log(user);
    $("#messages").append($("<li>").text(`${user} Connected...`));
  });
  soc.on("user-left", user => {
    // console.log(user);
    $("#messages").append($("<li>").text(`${user} Left...`));
  });
});

function scrollToBottom() {
  document
    .querySelector("#messages")
    .scrollTo(0, document.querySelector("#messages").scrollHeight);
}
