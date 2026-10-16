export const SNIPER_SCOPE_OVERLAY = (() => {
  const overlay = document.createElement("div");
  const background = `radial-gradient(
                            circle at center,
                            transparent 0,
                            transparent 220px,
                            black 221px,
                            black 100%
                          )`;
  const backgroundImage = `url('/scope-overlay.png'),
                        radial-gradient(
                          circle at center,
                          transparent 0,
                          transparent 220px,
                          black 221px,
                          black 100%
                        )`;

  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = background;
  overlay.style.backgroundImage = backgroundImage;
  overlay.style.backgroundPosition = "center";
  overlay.style.backgroundRepeat = "no-repeat";

  return overlay;
})();

export const FULLY_TRANSPARENT_OVERLAY = (() => {
  const overlay = document.createElement("div");
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "";
  overlay.style.backgroundImage = "";
  overlay.style.backgroundPosition = "";
  overlay.style.backgroundRepeat = "";
  return overlay;
})();
