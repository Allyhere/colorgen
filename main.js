const { random, floor } = Math;
const generatorBtn = document.querySelector(".btn--container");
const colorButtons = [...document.querySelectorAll(".generator button")];
const colorContainers = colorButtons.map((button) => button.parentElement);

const randomBetween = (min, max) => floor(random() * (max - min + 1)) + min;

const generateRandomHSLColor = () => {
  const MAX_SAT = 90;
  const MIN_SAT = 10;
  const MAX_LIG = 80;
  const MIN_LIG = 20;
  const randomHue = randomBetween(0, 360);
  const randomLighting = randomBetween(MIN_LIG, MAX_LIG);
  const randomSaturation = randomBetween(MIN_SAT, MAX_SAT);
  return `hsl(${randomHue}, ${randomLighting}, ${randomSaturation})`;
};

const generateColors = async () => {
  const colorFetch = await fetch(
    `https://www.thecolorapi.com/scheme?hsl=${generateRandomHSLColor()}&mode=analogic&count=6`
  );
  const colorJSON = await colorFetch.json();
  return colorJSON;
};

const parsePalette = (palette) => {
  return palette.colors.map((color) => color.rgb.value);
};

const insertPalette = (palette) =>
  colorContainers.forEach((container, colorIndex) => {
    container.children[0].innerText = `Copy color ${palette[colorIndex]}`;
    container.style.setProperty("--color-layer", palette[colorIndex]);
  });

function copyColor() {
  const elementStyles = getComputedStyle(this.parentElement);
  const styleValue =
    elementStyles.getPropertyValue("--color-layer") ||
    elementStyles.backgroundColor;
  navigator.clipboard.writeText(styleValue).then(() => console.log("copied"));
}

const createColorSchemeLayout = async () => {
  const colors = await generateColors();
  const palette = parsePalette(colors);
  insertPalette(palette);
};

colorButtons.forEach((btn) => btn.addEventListener("click", copyColor));
generatorBtn.addEventListener("click", createColorSchemeLayout);
