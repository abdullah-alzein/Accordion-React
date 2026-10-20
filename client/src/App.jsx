import { useMemo, useState } from "react";
import "./App.css";

/* ---------- Content ---------- */
const FAQ = [
  { q: "Do I need a reservation?", a: "Walk-ins are welcome, but we recommend booking, especially Friday through Sunday. You can reserve online or by phone up to 60 days ahead." },
  { q: "What are your opening hours?", a: "Dinner is served Tuesday to Sunday, 5:30 pm to 10:30 pm. Weekend brunch runs from 11 am to 3 pm. We are closed on Mondays." },
  { q: "Do you accommodate dietary needs?", a: "Yes. Vegetarian, vegan, gluten-free and nut-free dishes are marked on the menu. Tell your server about any allergies and the kitchen will adjust the dish." },
  { q: "Is there a dress code?", a: "Smart casual. We ask guests to avoid athletic wear and flip-flops so every table feels at ease." },
  { q: "Can I host a private event?", a: "Our private room seats up to 24 guests, and the full restaurant can be booked for up to 80. Send our events team your date and guest count to get a quote." },
  { q: "Do you offer a tasting menu?", a: "Our seven-course chef's tasting menu is $95 per person, with an optional wine pairing for $60. The whole table must take part, and we ask for 48 hours' notice." },
  { q: "What is your cancellation policy?", a: "Cancel free of charge up to 24 hours before your booking. Later cancellations and no-shows may be charged $25 per guest for tasting menu reservations." },
  { q: "Is parking available?", a: "Complimentary valet service starts at 5 pm. There is also a public garage one block north, on Alder Street." },
];

/* ---------- Option maps ---------- */
const BORDERS = {
  none: { label: "None", gap: 8, item: "background: #eef1ef;\n  border-radius: 10px;" },
  solid: { label: "Solid", gap: 0, item: "border: 1px solid #c4ccc7;\n}\n.acc__item + .acc__item {\n  border-top: 0;" },
  dashed: { label: "Dashed", gap: 10, item: "border: 1px dashed #8a9a91;\n  border-radius: 6px;" },
  rounded: { label: "Rounded", gap: 10, item: "border: 1px solid #c4ccc7;\n  border-radius: 16px;\n  background: #fff;" },
  underline: { label: "Underline", gap: 0, item: "border-bottom: 1px solid #c4ccc7;" },
};
const ICONS = {
  chevron: { label: "Chevron", d: "M6 9l6 6 6-6", rotate: 180 },
  plus: { label: "Plus", d: "M5 12h14M12 5v14", rotate: 45 },
  arrow: { label: "Arrow", d: "M12 5v14M6 13l6 6 6-6", rotate: 180 },
};
const DEFAULTS = { count: 5, border: "solid", icon: "chevron", pos: "right", heading: 3, animate: true };

/* ---------- Code generators (single source of truth for preview + code) ---------- */
function buildCSS(c) {
  const b = BORDERS[c.border];
  return `.acc {
  display: flex;
  flex-direction: column;
  gap: ${b.gap}px;
  max-width: 720px;
}
.acc__item {
  ${b.item}
}
.acc__heading {
  margin: 0;
  font-size: 1.05rem;
}
.acc__trigger {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 18px 20px;
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}
.acc__trigger:focus-visible {
  outline: 2px solid #b88a2e;
  outline-offset: -2px;
}
.acc__label { flex: 1; }
.acc__icon {
  width: 20px;
  height: 20px;
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.is-open .acc__icon { transform: rotate(${ICONS[c.icon].rotate}deg); }
.acc__panel {
  display: grid;
  grid-template-rows: 0fr;
}
.is-open .acc__panel { grid-template-rows: 1fr; }
.acc__body {
  overflow: hidden;
  visibility: hidden;
}
.is-open .acc__body { visibility: visible; }
.acc__body p {
  margin: 0;
  padding: 0 20px 20px;
  line-height: 1.6;
}${c.animate ? `

/* Animation */
.acc__icon { transition: transform 0.25s ease; }
.acc__panel { transition: grid-template-rows 0.3s ease; }
.acc__body { transition: visibility 0.3s; }
@media (prefers-reduced-motion: reduce) {
  .acc__icon, .acc__panel, .acc__body { transition: none; }
}` : ""}
`;
}

function buildJSX(c) {
  const items = FAQ.slice(0, c.count);
  const icon = `<svg className="acc__icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="${ICONS[c.icon].d}" />
                </svg>`;
  const label = `<span className="acc__label">{item.q}</span>`;
  const [first, second] = c.pos === "left" ? [icon, label] : [label, icon];
  const H = `h${c.heading}`;
  return `import { useState } from "react";
import "./Accordion.css";

const items = [
${items.map((i) => `  { q: ${JSON.stringify(i.q)}, a: ${JSON.stringify(i.a)} },`).join("\n")}
];

export default function Accordion() {
  const [open, setOpen] = useState([]);

  const toggle = (i) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));

  return (
    <div className="acc">
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        return (
          <div key={i} className={"acc__item" + (isOpen ? " is-open" : "")}>
            <${H} className="acc__heading">
              <button
                type="button"
                id={"trigger-" + i}
                className="acc__trigger"
                aria-expanded={isOpen}
                aria-controls={"panel-" + i}
                onClick={() => toggle(i)}
              >
                ${first}
                ${second}
              </button>
            </${H}>
            <div
              id={"panel-" + i}
              role="region"
              aria-labelledby={"trigger-" + i}
              className="acc__panel"
            >
              <div className="acc__body">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
`;
}

/* ---------- UI pieces ---------- */
function Segmented({ label, value, options, onChange }) {
  return (
    <div className="field">
      <span className="field__label" id={`l-${label}`}>{label}</span>
      <div className="seg" role="radiogroup" aria-labelledby={`l-${label}`}>
        {options.map(([v, text]) => (
          <button key={v} type="button" role="radio" aria-checked={value === v}
            className={value === v ? "seg__btn is-on" : "seg__btn"} onClick={() => onChange(v)}>
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function Preview({ cfg, open, toggle }) {
  const H = `h${cfg.heading}`;
  const icon = (
    <svg className="acc__icon" viewBox="0 0 24 24" aria-hidden="true"><path d={ICONS[cfg.icon].d} /></svg>
  );
  return (
    <div className="acc">
      {FAQ.slice(0, cfg.count).map((item, i) => {
        const isOpen = open.includes(i);
        const label = <span className="acc__label">{item.q}</span>;
        return (
          <div key={i} className={"acc__item" + (isOpen ? " is-open" : "")}>
            <H className="acc__heading">
              <button type="button" id={"trigger-" + i} className="acc__trigger"
                aria-expanded={isOpen} aria-controls={"panel-" + i} onClick={() => toggle(i)}>
                {cfg.pos === "left" ? <>{icon}{label}</> : <>{label}{icon}</>}
              </button>
            </H>
            <div id={"panel-" + i} role="region" aria-labelledby={"trigger-" + i} className="acc__panel">
              <div className="acc__body"><p>{item.a}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [cfg, setCfg] = useState(DEFAULTS);
  const [open, setOpen] = useState([0]);
  const [tab, setTab] = useState("jsx");
  const [copied, setCopied] = useState(false);

  const set = (k) => (v) => setCfg((c) => ({ ...c, [k]: v }));
  const visibleOpen = open.filter((i) => i < cfg.count);
  const toggle = (i) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));

  const css = useMemo(() => buildCSS(cfg), [cfg]);
  const jsx = useMemo(() => buildJSX(cfg), [cfg]);
  const code = tab === "jsx" ? jsx : css;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const t = document.createElement("textarea");
      t.value = code; document.body.appendChild(t); t.select();
      document.execCommand("copy"); t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const traits = [
    `${cfg.count} ${cfg.count === 1 ? "question" : "questions"}`,
    `${BORDERS[cfg.border].label} border`,
    `${ICONS[cfg.icon].label} icon`,
    `Icon ${cfg.pos}`,
    `Heading h${cfg.heading}`,
    cfg.animate ? "Animated" : "No animation",
  ];

  return (
    <div className="app">
      <header className="top">
        <div className="brand">Fine Dine</div>
        <p className="top__sub">Accordion builder. Adjust the settings, check the preview, copy the code.</p>
      </header>

      <div className="layout">
        {/* 1. Customize */}
        <aside className="panel customize" aria-label="Customize">
          <h2 className="panel__title">Customize</h2>

          <div className="field">
            <label className="field__label" htmlFor="count">
              Questions shown <output className="count">{cfg.count}</output>
            </label>
            <input id="count" type="range" min="1" max="8" value={cfg.count}
              onChange={(e) => set("count")(+e.target.value)} />
          </div>

          <Segmented label="Border style" value={cfg.border} onChange={set("border")}
            options={Object.entries(BORDERS).map(([k, v]) => [k, v.label])} />
          <Segmented label="Icon type" value={cfg.icon} onChange={set("icon")}
            options={Object.entries(ICONS).map(([k, v]) => [k, v.label])} />
          <Segmented label="Icon position" value={cfg.pos} onChange={set("pos")}
            options={[["left", "Left"], ["right", "Right"]]} />
          <Segmented label="Heading level" value={cfg.heading} onChange={set("heading")}
            options={[2, 3, 4, 5, 6].map((n) => [n, `h${n}`])} />

          <div className="field field--row">
            <span className="field__label" id="anim-l">Animation</span>
            <button type="button" role="switch" aria-checked={cfg.animate} aria-labelledby="anim-l"
              className={cfg.animate ? "switch is-on" : "switch"} onClick={() => set("animate")(!cfg.animate)}>
              <span className="switch__knob" />
            </button>
          </div>

          <div className="actions">
            <button type="button" className="btn btn--primary" disabled={!visibleOpen.length}
              onClick={() => setOpen([])}>
              Collapse all{visibleOpen.length ? ` (${visibleOpen.length})` : ""}
            </button>
            <button type="button" className="btn" onClick={() => { setCfg(DEFAULTS); setOpen([0]); }}>
              Reset
            </button>
          </div>
        </aside>

        <main className="main">
          {/* 2. Preview */}
          <section className="panel" aria-label="Preview">
            <h2 className="panel__title">Preview</h2>
            <ul className="traits" aria-label="Selected options">
              {traits.map((t) => <li key={t} className="trait">{t}</li>)}
            </ul>
            <div className="stage">
              <style>{css}</style>
              <p className="stage__title">Before you visit</p>
              <Preview cfg={cfg} open={visibleOpen} toggle={toggle} />
            </div>
          </section>

          {/* 3. Live code */}
          <section className="panel code" aria-label="Live code">
            <div className="code__bar">
              <h2 className="panel__title">Live code</h2>
              <div className="tabs" role="tablist">
                {[["jsx", "Accordion.jsx"], ["css", "Accordion.css"]].map(([k, t]) => (
                  <button key={k} role="tab" aria-selected={tab === k}
                    className={tab === k ? "tab is-on" : "tab"} onClick={() => setTab(k)}>{t}</button>
                ))}
              </div>
              <button type="button" className="btn btn--gold" onClick={copy}>
                {copied ? "Copied" : "Copy code"}
              </button>
            </div>
            <pre className="code__pre" tabIndex={0}><code>{code}</code></pre>
            <span className="sr" aria-live="polite">{copied ? "Code copied to clipboard" : ""}</span>
          </section>
        </main>
      </div>
    </div>
  );
}
