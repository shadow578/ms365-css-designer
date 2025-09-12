import "jest";
import type { CSSStyleDefinition } from "./definitions";
import generateCSS from "./generator";

describe("generator", () => {
  test("generates css from style object", () => {
    const style: CSSStyleDefinition = {
      ".ext-boilerplate-text": {
        // kind: color
        color: "#ff0000",

        // kind: dimension
        "margin-bottom": {
          unit: "px",
          value: 10,
        },

        // kind: alignment
        "text-align": "center",

        // kind: fontWeight
        "font-weight": 600,

        // kind: dimension, font-size
        "font-size": {
          unit: "em",
          value: 1.5,
        },

        // kind: fontFamily
        "font-family": "Arial",
      },
      ".ext-button": {
        // .ext-button and .ext-button:hover should both be generated
        color: "#00ff00",
        "color$:hover": "#0000ff",
      },
      ".ext-background-image": {
        // kind: url
        "background-image": "https://example.com/image.png",
      },
    };
    const expectedCSS = `
.ext-boilerplate-text {
  color: #ff0000;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 600;
  font-size: 1.5em;
  font-family: 'Arial';
}
.ext-button {
  color: #00ff00;
}
/* due to color$:hover on .ext-button */
.ext-button:hover {
  color: #0000ff;
}
.ext-background-image {
  background-image: url('https://example.com/image.png');
}
`;

    const generatedCSS = generateCSS(style, { important: false });

    const normalize = (css: string) => {
      // remove comments
      css = css.replace(/\/\*.*?\*\//g, "").trim();

      // there may be some whitespace differences we don't care about
      css = css.replaceAll(/\s+/g, " ").trim();

      return css;
    };
    expect(normalize(generatedCSS)).toBe(normalize(expectedCSS));
  });
});
