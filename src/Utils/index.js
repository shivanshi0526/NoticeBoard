export function setTransform(element, frame) {
    element.style.cssText = toCSS(frame);
    element.setAttribute("data-frame", JSON.stringify(frame));
}

export function isOverlapping(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}
export function toCSS(properties) {
    var cssObject = {};

    for (let name in properties) {
        let value = properties[name];
        if (typeof value == "object") {
            let values = [];
            for (let i in value) {
                values.push(`${i}(${value[i]})`);
            }
            cssObject[name] = values.join(" ");
            continue;
        }
        cssObject[name] = value;
    }
    var cssArray = [];

    for (let name in cssObject) {
        cssArray.push(name + ":" + cssObject[name] + ";");
    }
    return cssArray.join("");
}
