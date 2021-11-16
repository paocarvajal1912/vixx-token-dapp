function component() {
    const element = document.createElement("div");
    element.innerHTML = "Hello webpack!!!";
    return element;
}

codument.body.appendChild(component());

