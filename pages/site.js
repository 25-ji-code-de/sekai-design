/* SPDX-License-Identifier: Apache-2.0 */
/* SPDX-FileCopyrightText: 2026 The 25-ji-code-de Team */

const WORLD_KEY = "sekai-design-world";

function setWorld(world) {
  document.documentElement.classList.remove("world-system", "world-night");
  document.documentElement.classList.add(`world-${world}`);
  localStorage.setItem(WORLD_KEY, world);

  document.querySelectorAll("[data-world]").forEach((button) => {
    const active = button.dataset.world === world;
    button.className =
      "sekai-btn sekai-btn--sm " +
      (active ? "sekai-btn--primary" : "sekai-btn--secondary");
    button.setAttribute("aria-pressed", String(active));
  });

  document.dispatchEvent(new CustomEvent("sekai:worldchange", { detail: { world } }));
}

const initialWorld = localStorage.getItem(WORLD_KEY) || "night";
setWorld(initialWorld === "system" ? "system" : "night");

document.querySelectorAll("[data-world]").forEach((button) => {
  button.addEventListener("click", () => setWorld(button.dataset.world));
});

const tokenGrid = document.getElementById("token-grid");
if (tokenGrid) {
  const filter = document.getElementById("token-filter");
  const copyButton = document.getElementById("copy-css");
  let names = [];

  const getValue = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  const isRgbTriplet = (value) => /^\d+(?:\.\d+)?\s+\d+(?:\.\d+)?\s+\d+(?:\.\d+)?$/.test(value);

  function renderTokens() {
    const query = filter.value.trim().toLowerCase();
    const shown = names.filter((name) => name.toLowerCase().includes(query));

    tokenGrid.replaceChildren(
      ...shown.map((name) => {
        const value = getValue(name);
        const card = document.createElement("article");
        card.className = "token-card";

        const swatch = document.createElement("div");
        swatch.className = "token-card__swatch";
        if (isRgbTriplet(value)) {
          swatch.style.setProperty("--token-rgb", value);
        } else {
          swatch.style.background =
            "linear-gradient(135deg, rgb(var(--sekai-surface-hover)), rgb(var(--sekai-surface-sunken)))";
        }

        const body = document.createElement("div");
        body.className = "token-card__body";
        const code = document.createElement("code");
        code.textContent = name;
        const output = document.createElement("span");
        output.className = "token-card__value";
        output.textContent = value || "(未赋值)";
        body.append(code, output);
        card.append(swatch, body);
        return card;
      }),
    );
  }

  fetch("/assets/sekai-tokens.css")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then((css) => {
      names = [...new Set([...css.matchAll(/--sekai-[a-z0-9-]+(?=\s*:)/g)].map((match) => match[0]))]
        .sort((a, b) => a.localeCompare(b));
      renderTokens();
    })
    .catch((error) => {
      tokenGrid.textContent = `无法读取令牌：${error.message}`;
    });

  filter.addEventListener("input", renderTokens);
  document.addEventListener("sekai:worldchange", renderTokens);

  copyButton.addEventListener("click", async () => {
    const lines = names.map((name) => `  ${name}: ${getValue(name)};`);
    const world = document.documentElement.classList.contains("world-system")
      ? "world-system"
      : "world-night";
    const css = `.${world} {\n${lines.join("\n")}\n}`;

    try {
      await navigator.clipboard.writeText(css);
      copyButton.textContent = "已复制";
      setTimeout(() => (copyButton.textContent = "复制当前 world 的 CSS"), 1600);
    } catch {
      copyButton.textContent = "复制失败";
    }
  });
}
