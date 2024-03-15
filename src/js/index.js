const boxes = document.querySelectorAll(".box");

const addAnimation = (outer, inner) => {
  outer.addEventListener("mouseenter", () => {
    anime({
      targets: inner,
      scale: 1.1,
      duration: 500,
    });
  });

  outer.addEventListener("mouseleave", () => {
    anime({
      targets: inner,
      scale: 1.0,
      duration: 500,
    });
  });

  outer.addEventListener("mousedown", () => {
    anime({
      targets: inner,
      scale: 1.0,
      duration: 500,
    });
  });
};

for (let box of boxes) {
  if (box.id == "follow") {
    let buttons = box.getElementsByTagName("a");

    console.log(buttons);

    for (let button of buttons) {
      addAnimation(button, button);
    }
  } else {
    box.addEventListener("click", () => {
      window.location.href = box.id + ".html";
    });
    addAnimation(box, box.children[0]);
  }
}
