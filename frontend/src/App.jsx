import { useEffect, useState } from "react";
import { NavLink, Routes, Route, Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  Home as HomeIcon,
  Menu,
  ShieldCheck,
  Target,
  X,
  ExternalLink,
  LineChart as LineChartIcon
} from "lucide-react";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar
} from "recharts";
import { getDatasets, getMethods, getLiterature, runExperiment, getAblation } from "./api";

const contributions = [
  ["N1", "Probabilistic regime weighting", "Use soft regime compatibility instead of a hard reset after a detected change."],
  ["N2", "Regime-conditioned local geometry", "Combine regime compatibility with similarity in an interpretable lag-state space."],
  ["N3", "Entropy-controlled locality", "Use regime uncertainty to automatically control calibration bandwidth."],
  ["N4", "Reliability-aware calibration", "Use effective sample size to detect over-concentrated calibration weights and fall back safely."]
];

const nav = [
  ["/", "Overview", HomeIcon],
  ["/problem", "Why this problem?", BookOpen],
  ["/method", "Proposed method", FlaskConical],
  ["/experiments", "Experiments", LineChartIcon],
  ["/ablations", "Ablations", Target],
  ["/theory", "Mathematics", ShieldCheck],
  ["/literature", "Literature", BookOpen],
];

function Layout({ children }) {
  const [open, setOpen] = useState(false);
  return <div className="min-h-screen">
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-extrabold text-white">CP</div>
          <div><div className="font-display text-sm font-extrabold">PRG-ACP</div><div className="text-[11px] text-slate-500">Thesis research</div></div>
        </Link>
        <button className="p-2 md:hidden" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map(([to, label, Icon]) => <NavLink key={to} to={to} className={({isActive}) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50"}`}><Icon size={16}/>{label}</NavLink>)}
        </nav>
      </div>
      {open && <nav className="border-t px-5 py-3 md:hidden">{nav.map(([to,label]) => <NavLink onClick={() => setOpen(false)} key={to} to={to} className="block rounded-lg px-3 py-2 text-sm">{label}</NavLink>)}</nav>}
    </header>
    <main>{children}</main>
    <footer className="mt-20 border-t bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-8 text-sm text-slate-500 lg:flex-row lg:justify-between lg:px-8">
        <span>PRG-ACP · Undergraduate thesis · Mathematics + AI/ML</span>
        <span>Research prototype — replace demo outputs with validated results.</span>
      </div>
    </footer>
  </div>;
}

function Section({ eyebrow, title, children }) {
  return <div className="max-w-3xl"><div className="eyebrow mb-3">{eyebrow}</div><h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h2>{children && <p className="mt-4 leading-7 text-slate-600">{children}</p>}</div>;
}

function Math({ children }) {
  return <div className="my-5 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-center font-mono text-sm leading-8 text-slate-100">{children}</div>;
}

function Pipeline() {
  const steps = [
    ["01","Forecast","Lightweight CPU-friendly model"],
    ["02","Residuals","Historical forecast errors"],
    ["03","Regime","Probabilistic regime compatibility"],
    ["04","Geometry","Local lag-state similarity"],
    ["05","Weights","Regime + geometry + recency"],
    ["06","Quantile","Weighted conformal radius"],
    ["07","Interval","Prediction interval"]
  ];
  return <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{steps.map(([n,t,d]) => <div className="card p-5" key={n}><div className="text-xs font-bold text-cyan-700">{n}</div><h3 className="mt-3 font-display font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{d}</p></div>)}</div>;
}

function Home() {
  return <>
    <section className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="max-w-4xl">
          <div className="eyebrow">Undergraduate thesis · Mathematics + AI/ML</div>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight md:text-6xl">Making prediction intervals adapt when a time series changes.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">This project investigates whether conformal prediction can remain reliable when the data-generating process is not stationary — without requiring a GPU or a large neural network.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link className="btn-primary" to="/problem">Start with the problem <ArrowRight size={16} className="ml-2"/></Link><Link className="btn-secondary" to="/method">See the proposed method</Link></div>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            ["The problem","Standard conformal methods become harder to calibrate when the data distribution evolves over time."],
            ["The goal","Keep empirical coverage near its target without making intervals unnecessarily wide."],
            ["The approach","Combine probabilistic regimes, local geometry, adaptive locality and reliability checks."]
          ].map(([t,d]) => <div className="card p-6" key={t}><CheckCircle2 className="text-cyan-700"/><h3 className="mt-4 font-display text-lg font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{d}</p></div>)}
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <Section eyebrow="One-minute explanation" title="What does the project actually do?">Instead of treating every historical observation as equally useful, the method asks which observations resemble the current situation and belong to a compatible regime.</Section>
      <div className="mt-10"><Pipeline/></div>
    </section>
    <section className="bg-slate-900 py-16 text-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8"><Section eyebrow="Research contributions" title="Four ideas being investigated">These are proposed contributions, not claims of guaranteed novelty. They must be validated through the literature and controlled ablation experiments.</Section>
      <div className="mt-10 grid gap-4 md:grid-cols-2">{contributions.map(([n,t,d]) => <div className="rounded-2xl border border-white/10 bg-white/5 p-6" key={n}><div className="text-sm font-bold text-cyan-300">{n}</div><h3 className="mt-2 font-display text-xl font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{d}</p></div>)}</div></div>
    </section>
  </>;
}

// function Problem() {
//   return <Page><Section eyebrow="01 · Motivation" title="Why is this a problem?">A point forecast says what the model expects. A prediction interval also says how uncertain that forecast is. Conformal prediction offers a distribution-free way to build intervals, but non-stationary time series violate the simple assumptions behind ordinary calibration.</Section>
//     <div className="mt-10 grid gap-6 lg:grid-cols-3">
//       <div className="card p-7 lg:col-span-2"><div className="eyebrow">From prediction to uncertainty</div><h3 className="mt-2 font-display text-2xl font-bold">We want an interval, not just a number.</h3><Math>ŷₜ₊₁ = f(yₜ, yₜ₋₁, …, yₜ₋ₚ₊₁)</Math><Math>Cₜ₊₁ = [ŷₜ₊₁ − qₜ, ŷₜ₊₁ + qₜ]</Math><p className="text-sm leading-7 text-slate-600">The difficulty is that time series are dependent and may change regime. Old residuals can become unrepresentative of current uncertainty.</p></div>
//       <div className="card bg-amber-50 p-7"><div className="text-amber-700"><Target/></div><h3 className="mt-4 font-display text-xl font-bold">What can change?</h3><ul className="mt-4 space-y-3 text-sm leading-6"><li>• Mean level</li><li>• Variance</li><li>• Autoregressive relationships</li><li>• Forecast difficulty</li><li>• Relevant historical regimes</li></ul></div>
//     </div>
//     <div className="mt-14"><Section eyebrow="Research gap" title="Why not simply use recent observations?">A recent window adapts quickly but can throw away useful recurring regimes. Generic similarity weighting helps, but similarity alone does not tell us whether two observations belong to compatible regimes.</Section></div>
//     <div className="mt-8 grid gap-4 md:grid-cols-3">{[
//       ["Global calibration","Uses all historical residuals and may adapt slowly after a shift."],
//       ["Recent-window calibration","Adapts quickly but discards older recurring regimes."],
//       ["Generic similarity","Uses local similarity without explicitly modeling probabilistic regime compatibility."]
//     ].map(([t,d]) => <div className="card p-6" key={t}><h3 className="font-display font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{d}</p></div>)}</div>
//     <div className="mt-14 rounded-3xl bg-slate-900 p-8 text-white"><div className="eyebrow text-cyan-300">Research question</div><h2 className="mt-3 max-w-4xl font-display text-2xl font-extrabold md:text-4xl">Can probabilistic regime compatibility and local geometric similarity jointly select better calibration residuals under distribution shift?</h2></div>
//   </Page>;
// }


function Problem() {
  return (
    <Page>
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white md:px-10 md:py-16">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative max-w-4xl">
          <div className="eyebrow text-cyan-300">
            01 · Understanding the problem
          </div>

          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight md:text-6xl">
            Why is prediction uncertainty difficult when a time series changes?
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Before understanding the proposed method, we first need to
            understand the problem it is trying to solve. This page explains
            the problem from the ground up, without assuming prior knowledge
            of conformal prediction or machine learning.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#intuition" className="btn-primary">
              Start with intuition
              <ArrowRight size={16} className="ml-2" />
            </a>

            <a href="#research-gap" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20">
              Jump to research gap
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          TABLE OF CONTENTS
      ========================================================= */}
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
          On this page
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["01", "What is a time series?", "#intuition"],
            ["02", "Prediction vs uncertainty", "#uncertainty"],
            ["03", "What changes over time?", "#shift"],
            ["04", "Why ordinary calibration struggles", "#calibration"],
            ["05", "Why recent data is not enough", "#recent"],
            ["06", "Research gap", "#research-gap"],
            ["07", "Research question", "#research-question"],
            ["08", "What this thesis proposes", "#solution-preview"],
          ].map(([number, title, href]) => (
            <a
              href={href}
              key={number}
              className="group rounded-xl border border-slate-200 p-4 transition hover:border-cyan-300 hover:bg-cyan-50"
            >
              <div className="text-xs font-bold text-cyan-700">{number}</div>
              <div className="mt-1 text-sm font-semibold text-slate-800 group-hover:text-cyan-800">
                {title}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 1 — SIMPLE INTUITION
      ========================================================= */}
      <section id="intuition" className="scroll-mt-24 pt-16">
        <Section
          eyebrow="01 · Start from zero"
          title="First: what is a time series?"
        >
          A time series is simply a sequence of observations collected over
          time. Examples include temperature measured every hour, electricity
          demand every 15 minutes, stock prices every day, or CPU usage every
          second.
        </Section>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Example */}
          <div className="card p-7">
            <div className="eyebrow">Simple example</div>

            <h3 className="mt-2 font-display text-2xl font-bold">
              Imagine predicting electricity demand.
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Suppose we record electricity demand every hour. A forecasting
              model looks at the previous observations and tries to predict the
              next one.
            </p>

            <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-6 bg-slate-50 text-center text-xs font-bold text-slate-500">
                {["10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM"].map(
                  (x) => (
                    <div key={x} className="border-r p-3 last:border-r-0">
                      {x}
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-6 text-center">
                {[42, 45, 48, 51, 53, "?"].map((x, i) => (
                  <div
                    key={i}
                    className={`p-4 text-sm font-bold ${
                      x === "?"
                        ? "bg-cyan-50 text-cyan-700"
                        : "text-slate-800"
                    }`}
                  >
                    {x}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-cyan-50 p-4 text-sm leading-6 text-cyan-900">
              <strong>The task:</strong> Based on the values we have already
              observed, estimate what happens next.
            </div>
          </div>

          {/* Forecasting flow */}
          <div className="card p-7">
            <div className="eyebrow">Forecasting in plain English</div>

            <h3 className="mt-2 font-display text-2xl font-bold">
              The model is essentially asking:
            </h3>

            <div className="mt-6 space-y-3">
              {[
                ["1", "What happened recently?"],
                ["2", "What patterns usually occur after this situation?"],
                ["3", "How difficult is this situation to predict?"],
                ["4", "What should I expect next?"],
              ].map(([n, text]) => (
                <div
                  key={n}
                  className="flex items-start gap-4 rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                    {n}
                  </div>

                  <p className="text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2 — POINT FORECAST VS INTERVAL
      ========================================================= */}
      <section id="uncertainty" className="scroll-mt-24 pt-20">
        <Section
          eyebrow="02 · The important distinction"
          title="Predicting a number is not the same as predicting uncertainty."
        >
          A forecasting model may tell us that tomorrow's demand will be
          around 60 units. But how confident should we be? The real-world
          value could be 55, 61, 70, or something much further away.
        </Section>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="card p-7">
            <div className="eyebrow">Point forecast</div>

            <h3 className="mt-2 font-display text-2xl font-bold">
              "I think the answer is 60."
            </h3>

            <div className="my-8 flex items-center justify-center">
              <div className="rounded-2xl bg-slate-950 px-10 py-8 text-center text-white">
                <div className="text-xs uppercase tracking-widest text-slate-400">
                  Forecast
                </div>
                <div className="mt-2 text-5xl font-extrabold">60</div>
                <div className="mt-2 text-sm text-slate-400">units</div>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              This gives us an expected value, but it does not tell us how
              uncertain the prediction is.
            </p>
          </div>

          <div className="card p-7">
            <div className="eyebrow">Prediction interval</div>

            <h3 className="mt-2 font-display text-2xl font-bold">
              "I expect the answer to be between 52 and 68."
            </h3>

            <div className="my-8">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>52</span>
                <span>60</span>
                <span>68</span>
              </div>

              <div className="relative mt-3 h-4 rounded-full bg-slate-100">
                <div className="absolute left-[8%] right-[8%] h-4 rounded-full bg-cyan-200" />
                <div className="absolute left-1/2 top-1/2 h-7 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900" />
              </div>

              <div className="mt-3 text-center text-xs text-slate-500">
                Prediction interval
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              This is much more useful for decision-making because it gives an
              idea of the uncertainty around the forecast.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-6">
          <div className="flex gap-4">
            <div className="mt-1">
              <ShieldCheck className="text-cyan-700" />
            </div>

            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                The thesis is mainly about the interval.
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-700">
                The central question is not simply "Can we predict the next
                value?" Instead, it is:
                <strong>
                  {" "}
                  Can we construct a reliable uncertainty interval when the
                  behaviour of the time series changes?
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3 — STATIONARY VS NON-STATIONARY
      ========================================================= */}
      <section id="shift" className="scroll-mt-24 pt-20">
        <Section
          eyebrow="03 · Where the difficulty begins"
          title="The world does not always behave the same way."
        >
          Many standard calibration ideas become easier when the data behaves
          relatively consistently. Real time series, however, can change
          their behaviour over time.
        </Section>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Stable */}
          <div className="card overflow-hidden">
            <div className="bg-emerald-50 p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Situation A
              </div>

              <h3 className="mt-2 font-display text-2xl font-bold">
                Relatively stable behaviour
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                The average level and variability remain broadly similar.
              </p>
            </div>

            <div className="p-6">
              <div className="flex h-40 items-end gap-2 rounded-xl bg-slate-50 p-5">
                {[35, 45, 42, 52, 47, 55, 51, 58, 54, 60, 56, 62].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-emerald-400/70"
                      style={{ height: `${h}%` }}
                    />
                  )
                )}
              </div>

              <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                Historical observations are more likely to remain relevant to
                the current situation.
              </div>
            </div>
          </div>

          {/* Changing */}
          <div className="card overflow-hidden">
            <div className="bg-rose-50 p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-rose-700">
                Situation B
              </div>

              <h3 className="mt-2 font-display text-2xl font-bold">
                Behaviour changes over time
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                The data may suddenly move to a different level or become much
                more volatile.
              </p>
            </div>

            <div className="p-6">
              <div className="relative flex h-40 items-end gap-2 rounded-xl bg-slate-50 p-5">
                {[25, 30, 27, 32, 29, 31, 65, 80, 55, 90, 60, 85].map(
                  (h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t ${
                        i >= 6
                          ? "bg-rose-400/70"
                          : "bg-slate-400/60"
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  )
                )}

                <div className="absolute left-[51%] top-3 bottom-3 border-l-2 border-dashed border-rose-500" />

                <div className="absolute left-[53%] top-1 rounded bg-rose-100 px-2 py-1 text-[10px] font-bold text-rose-700">
                  Behaviour changes
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-rose-50 p-4 text-sm leading-6 text-rose-900">
                Old observations may no longer describe the uncertainty we
                currently face.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 card p-7">
          <div className="eyebrow">What can change?</div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Mean", "The typical level can move."],
              ["Variance", "The amount of fluctuation can increase or decrease."],
              ["Relationships", "Lag relationships can change."],
              ["Noise", "Forecast errors can become larger or smaller."],
              ["Regime", "The system can enter a different behavioural state."],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-xl border border-slate-200 p-4"
              >
                <h4 className="font-display font-bold">{title}</h4>
                <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 4 — CONFORMAL PREDICTION
      ========================================================= */}
      <section id="calibration" className="scroll-mt-24 pt-20">
        <Section
          eyebrow="04 · Why conformal prediction enters the picture"
          title="How can we build an uncertainty interval?"
        >
          Conformal prediction provides a way to use historical prediction
          errors to estimate how large a future error might be. The basic
          intuition is surprisingly simple.
        </Section>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            [
              "01",
              "Make historical forecasts",
              "Predict values for observations whose true values are already known.",
            ],
            [
              "02",
              "Measure the errors",
              "Compare each prediction with what actually happened.",
            ],
            [
              "03",
              "Use the errors",
              "Use the historical errors to determine how wide the next interval should be.",
            ],
          ].map(([n, title, text]) => (
            <div className="card p-6" key={n}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                {n}
              </div>

              <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>

        <div className="card mt-8 p-7">
          <div className="eyebrow">A simple numerical example</div>

          <h3 className="mt-2 font-display text-2xl font-bold">
            Suppose our historical errors looked like this:
          </h3>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-10">
            {[2, 3, 4, 3, 5, 4, 6, 5, 4, 7].map((x, i) => (
              <div
                key={i}
                className="rounded-xl bg-slate-100 p-3 text-center"
              >
                <div className="text-[10px] uppercase text-slate-400">
                  Error {i + 1}
                </div>
                <div className="mt-1 font-display font-bold">{x}</div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm leading-7 text-slate-600">
            If the historical errors are usually around 2–7 units, the model
            can use their distribution to construct an uncertainty radius
            around a new forecast.
          </p>

          <Math>
            Prediction interval = Forecast ± uncertainty radius
          </Math>
        </div>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex gap-4">
            <Target className="mt-1 shrink-0 text-amber-700" />

            <div>
              <h3 className="font-display text-lg font-bold">
                But here is the important problem...
              </h3>

              <p className="mt-2 text-sm leading-7 text-amber-900">
                What happens if the historical errors came from a completely
                different situation than the one we are currently experiencing?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 5 — THE CORE PROBLEM
      ========================================================= */}
      <section id="recent" className="scroll-mt-24 pt-20">
        <Section
          eyebrow="05 · The calibration problem"
          title="Old data can become misleading."
        >
          This is the central intuition behind the thesis. Historical
          observations are not automatically equally useful. Their usefulness
          depends on how similar the historical situation is to the current
          situation.
        </Section>

        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="border-b bg-slate-50 p-6">
            <div className="eyebrow">Illustrative scenario</div>

            <h3 className="mt-2 font-display text-2xl font-bold">
              Imagine a sudden change in the data.
            </h3>
          </div>

          <div className="p-6 md:p-10">
            <div className="relative">
              <div className="flex h-52 items-end gap-1 rounded-2xl bg-slate-50 px-4 py-6">
                {[
                  30, 35, 32, 36, 34, 37, 33, 36,
                  38, 35, 37, 40,
                  65, 85, 60, 92, 70, 88, 68, 95,
                ].map((height, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t ${
                      i >= 12
                        ? "bg-cyan-500/70"
                        : "bg-slate-400/60"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              <div className="absolute left-[60%] top-3 bottom-3 border-l-2 border-dashed border-cyan-600" />

              <div className="absolute left-[62%] top-0 rounded-lg bg-cyan-100 px-3 py-2 text-xs font-bold text-cyan-800">
                New regime / changed behaviour
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Historical period
                </div>
                <div className="mt-2 font-display text-lg font-bold">
                  Relatively stable
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Small fluctuations and a lower typical level.
                </p>
              </div>

              <div className="rounded-2xl bg-cyan-50 p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-cyan-600">
                  Current period
                </div>
                <div className="mt-2 font-display text-lg font-bold">
                  Different behaviour
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Larger fluctuations and a different level.
                </p>
              </div>

              <div className="rounded-2xl bg-rose-50 p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-rose-600">
                  The problem
                </div>
                <div className="mt-2 font-display text-lg font-bold">
                  Which errors should we trust?
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Old errors may underestimate today's uncertainty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 6 — THREE STRATEGIES
      ========================================================= */}
      <section className="pt-20">
        <Section
          eyebrow="06 · Why simple solutions are not enough"
          title="There are several obvious ways to handle this."
        >
          The thesis compares the underlying ideas behind three intuitive
          strategies. Each solves part of the problem, but each also has an
          important limitation.
        </Section>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* Global */}
          <div className="card overflow-hidden">
            <div className="bg-slate-900 p-6 text-white">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Strategy 1
              </div>
              <h3 className="mt-2 font-display text-xl font-bold">
                Use everything
              </h3>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-lg bg-slate-200"
                  />
                ))}
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                Use all historical residuals during calibration.
              </p>

              <div className="mt-5 rounded-xl bg-rose-50 p-4 text-sm leading-6 text-rose-900">
                <strong>Problem:</strong> old observations may be irrelevant
                after a distributional change.
              </div>
            </div>
          </div>

          {/* Recent */}
          <div className="card overflow-hidden">
            <div className="bg-slate-900 p-6 text-white">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Strategy 2
              </div>
              <h3 className="mt-2 font-display text-xl font-bold">
                Use only recent data
              </h3>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-8 w-8 rounded-lg ${
                      i >= 12 ? "bg-cyan-400" : "bg-slate-100"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                Ignore old observations and focus on a recent window.
              </p>

              <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <strong>Problem:</strong> recurring historical situations may
                be discarded even though they could be useful.
              </div>
            </div>
          </div>

          {/* Similarity */}
          <div className="card overflow-hidden">
            <div className="bg-slate-900 p-6 text-white">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Strategy 3
              </div>
              <h3 className="mt-2 font-display text-xl font-bold">
                Use similar observations
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-8 rounded-lg ${
                      [2, 5, 9, 14, 16].includes(i)
                        ? "bg-cyan-400"
                        : "bg-slate-100"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                Give more weight to historical observations that look similar
                to the current situation.
              </p>

              <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <strong>Problem:</strong> numerical similarity alone does not
                necessarily mean the observations belong to the same regime.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 7 — REGIME INTUITION
      ========================================================= */}
      <section className="pt-20">
        <Section
          eyebrow="07 · Why 'regime' matters"
          title="Two situations can look similar but behave differently."
        >
          A regime is simply a useful way of describing a particular
          behavioural state of the system. The important idea is that the same
          observed value can mean different things depending on the surrounding
          context.
        </Section>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="card p-7">
            <div className="rounded-2xl bg-blue-50 p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Example A
              </div>

              <h3 className="mt-2 font-display text-xl font-bold">
                Normal operating period
              </h3>

              <div className="mt-6 flex items-center gap-3">
                <div className="rounded-xl bg-white px-5 py-4 text-center shadow-sm">
                  <div className="text-xs text-slate-400">Current value</div>
                  <div className="mt-1 text-2xl font-bold">50</div>
                </div>

                <ArrowRight className="text-slate-400" />

                <div className="rounded-xl bg-white px-5 py-4 text-center shadow-sm">
                  <div className="text-xs text-slate-400">Typical next value</div>
                  <div className="mt-1 text-2xl font-bold">52</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-7">
            <div className="rounded-2xl bg-rose-50 p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-rose-600">
                Example B
              </div>

              <h3 className="mt-2 font-display text-xl font-bold">
                High-volatility period
              </h3>

              <div className="mt-6 flex items-center gap-3">
                <div className="rounded-xl bg-white px-5 py-4 text-center shadow-sm">
                  <div className="text-xs text-slate-400">Current value</div>
                  <div className="mt-1 text-2xl font-bold">50</div>
                </div>

                <ArrowRight className="text-slate-400" />

                <div className="rounded-xl bg-white px-5 py-4 text-center shadow-sm">
                  <div className="text-xs text-slate-400">Possible next values</div>
                  <div className="mt-1 text-xl font-bold">
                    35 — 65
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7">
          <h3 className="font-display text-xl font-bold">
            The key insight
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            Looking only at the current numerical value is not enough. We also
            need to consider the surrounding lagged behaviour and the likely
            regime of the system.
          </p>

          <Math>
            Current situation = regime information + local temporal geometry
          </Math>
        </div>
      </section>

      {/* =========================================================
          SECTION 8 — RESEARCH GAP
      ========================================================= */}
      <section id="research-gap" className="scroll-mt-24 pt-20">
        <Section
          eyebrow="08 · Research gap"
          title="So what exactly is missing?"
        >
          The central gap explored by this thesis is the combination of two
          kinds of information: whether a historical observation belongs to a
          compatible behavioural regime, and whether its local temporal state
          resembles the current state.
        </Section>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <div className="card p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
              <span className="font-bold text-slate-700">1</span>
            </div>

            <h3 className="mt-5 font-display text-xl font-bold">
              Regime compatibility
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Does this historical observation appear to come from a
              behavioural state compatible with the current one?
            </p>
          </div>

          <div className="card p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50">
              <span className="font-bold text-cyan-700">2</span>
            </div>

            <h3 className="mt-5 font-display text-xl font-bold">
              Local geometry
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Does the recent pattern of this historical observation resemble
              the pattern we are seeing now?
            </p>
          </div>

          <div className="card p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
              <span className="font-bold text-emerald-700">3</span>
            </div>

            <h3 className="mt-5 font-display text-xl font-bold">
              Reliability
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              If the method becomes too concentrated on only a few historical
              observations, can we detect that and respond safely?
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-slate-950 p-8 text-white md:p-10">
          <div className="eyebrow text-cyan-300">
            The research idea in one picture
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row">
            <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-center md:w-64">
              <div className="text-xs uppercase tracking-widest text-slate-400">
                Historical observation
              </div>

              <div className="mt-2 font-display text-lg font-bold">
                Is it relevant?
              </div>
            </div>

            <div className="hidden md:block">
              <ArrowRight className="text-cyan-400" />
            </div>

            <div className="w-full rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-6 text-center md:w-64">
              <div className="text-xs uppercase tracking-widest text-cyan-300">
                Two checks
              </div>

              <div className="mt-2 font-display text-lg font-bold">
                Regime + Geometry
              </div>
            </div>

            <div className="hidden md:block">
              <ArrowRight className="text-cyan-400" />
            </div>

            <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-center md:w-64">
              <div className="text-xs uppercase tracking-widest text-slate-400">
                Calibration
              </div>

              <div className="mt-2 font-display text-lg font-bold">
                Better-selected residuals
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 9 — RESEARCH QUESTION
      ========================================================= */}
      <section id="research-question" className="scroll-mt-24 pt-20">
        <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-8 md:p-12">
          <div className="eyebrow text-cyan-700">
            09 · Research question
          </div>

          <h2 className="mt-4 max-w-5xl font-display text-3xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
            Can probabilistic regime compatibility and local geometric
            similarity jointly select better calibration residuals under
            distribution shift?
          </h2>

          <p className="mt-6 max-w-4xl text-base leading-8 text-slate-700">
            In simple terms: when the behaviour of a time series changes, can
            we identify which historical prediction errors are actually useful
            for estimating today's uncertainty?
          </p>
        </div>
      </section>

      {/* =========================================================
          SECTION 10 — WHAT THE THESIS PROPOSES
      ========================================================= */}
      <section id="solution-preview" className="scroll-mt-24 pt-20">
        <Section
          eyebrow="10 · From problem to proposed solution"
          title="The proposed approach follows a simple intuition."
        >
          Instead of treating every historical residual equally, the proposed
          framework assigns different levels of importance to historical
          observations.
        </Section>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            [
              "N1",
              "Regime",
              "Is the historical situation behaviourally compatible with the current situation?",
            ],
            [
              "N2",
              "Geometry",
              "Does the local lag-state pattern look similar to the current pattern?",
            ],
            [
              "N3",
              "Locality",
              "How uncertain are we about the current regime, and how local should calibration become?",
            ],
            [
              "N4",
              "Reliability",
              "Are the weights becoming too concentrated on a tiny number of observations?",
            ],
          ].map(([n, title, text]) => (
            <div className="card p-6" key={n}>
              <div className="text-sm font-bold text-cyan-700">{n}</div>

              <h3 className="mt-2 font-display text-xl font-bold">
                {title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 card p-7">
          <div className="eyebrow">Overall pipeline</div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Forecast", "Predict the next value"],
              ["02", "Residuals", "Measure historical errors"],
              ["03", "Regime", "Estimate behavioural compatibility"],
              ["04", "Geometry", "Measure local similarity"],
              ["05", "Weights", "Combine the information"],
              ["06", "Quantile", "Estimate uncertainty"],
              ["07", "Interval", "Construct prediction bounds"],
              ["08", "Evaluate", "Measure coverage and efficiency"],
            ].map(([n, title, text]) => (
              <div
                key={n}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="text-xs font-bold text-cyan-700">{n}</div>

                <h4 className="mt-2 font-display font-bold">{title}</h4>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL TAKEAWAY
      ========================================================= */}
      <section className="pb-8 pt-20">
        <div className="rounded-3xl bg-slate-900 p-8 text-white md:p-12">
          <div className="max-w-4xl">
            <div className="eyebrow text-cyan-300">
              In one sentence
            </div>

            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight md:text-5xl">
              The problem is not simply that the data changes — it is that
              yesterday's uncertainty may no longer describe today's
              uncertainty.
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-300">
              Therefore, the thesis investigates whether calibration can become
              more selective: instead of blindly trusting all historical
              errors or throwing old data away completely, can we identify
              historical situations that are both behaviourally compatible and
              locally similar to the current one?
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/method" className="btn-primary">
                See the proposed method
                <ArrowRight size={16} className="ml-2" />
              </Link>

              <Link to="/experiments" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20">
                See experiments
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}


function Method() {
  return <Page><Section eyebrow="02 · Proposed method" title="PRG-ACP: Probabilistic Regime- and Geometry-Aware Adaptive Conformal Prediction">The framework is intentionally interpretable and CPU-friendly. Its central idea is to give historical residuals different influence based on regime compatibility, local geometry and recency.</Section>
    <div className="mt-10"><Pipeline/></div>
    <div className="mt-14 grid gap-6 lg:grid-cols-2">{[
      ["N1 · Regime","Soft regime compatibility","wᵢᴿ ≈ P(regimeᵢ = current regime | y₁:ₜ)"],
      ["N2 · Geometry","Local state similarity","dᵢ = √((zₜ − zᵢ)ᵀΣ⁻¹(zₜ − zᵢ))"],
      ["N3 · Locality","Entropy controls bandwidth","hₜ = hₘᵢₙ + (hₘₐₓ − hₘᵢₙ)Hₜ/Hₘₐₓ"],
      ["N4 · Reliability","Effective sample size safeguard","ESS = 1 / Σᵢ w̃ᵢ²"]
    ].map(([tag,t,m]) => <div className="card p-7" key={tag}><div className="eyebrow">{tag}</div><h3 className="mt-2 font-display text-2xl font-bold">{t}</h3><Math>{m}</Math></div>)}</div>
    <div className="card mt-10 p-7"><div className="eyebrow">Combined calibration</div><Math>wᵢ = (wᵢᴿ)^γ¹ (wᵢᴳ)^γ² (wᵢᵀ)^γ³</Math><Math>qₜ = WeightedQuantile₍₁₋α₎(r₁,…,rₜ₋₁ ; w₁,…,wₜ₋₁)</Math><Math>Cₜ = [ŷₜ − qₜ, ŷₜ + qₜ]</Math></div>
  </Page>;
}

function Page({children}) { return <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">{children}</div>; }

function Experiments() {
  const [datasets,setDatasets]=useState([]), [methods,setMethods]=useState([]), [dataset,setDataset]=useState("synthetic"), [method,setMethod]=useState("prg_acp"), [coverage,setCoverage]=useState(.9), [result,setResult]=useState(null), [loading,setLoading]=useState(false), [error,setError]=useState("");
  useEffect(()=>{Promise.all([getDatasets(),getMethods()]).then(([d,m])=>{setDatasets(d);setMethods(m)}).catch(()=>setError("Start the Python backend on port 8000."))},[]);
  async function run(){setLoading(true);setError("");try{setResult(await runExperiment({dataset,method,coverage,seed:7}))}catch{setError("Experiment failed. Check the backend.");}finally{setLoading(false)}}
  return <Page><Section eyebrow="03 · Experiments" title="Turn the method into measurable evidence.">Select a benchmark and calibration method. The backend returns coverage, width, interval score, ESS and a forecast/interval series.</Section>
    <div className="mt-10 grid gap-5 lg:grid-cols-[290px_1fr]">
      <div className="card h-fit p-6 space-y-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Dataset<select value={dataset} onChange={e=>setDataset(e.target.value)} className="mt-2 w-full rounded-xl border p-2.5 text-sm">{datasets.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Method<select value={method} onChange={e=>setMethod(e.target.value)} className="mt-2 w-full rounded-xl border p-2.5 text-sm">{methods.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Target coverage: {(coverage*100).toFixed(0)}%<input type="range" min=".8" max=".95" step=".01" value={coverage} onChange={e=>setCoverage(+e.target.value)} className="mt-3 w-full"/></label>
        <button className="btn-primary w-full" onClick={run} disabled={loading}>{loading?"Running…":"Run experiment"}</button>
        <p className="text-xs leading-5 text-slate-400">The supplied backend uses synthetic data so the website is immediately runnable. Connect real datasets after your baseline implementation is validated.</p>
      </div>
      <div>{error&&<div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}{loading&&<div className="card p-8">Running CPU experiment…</div>}
      {!loading&&!result&&<div className="card flex min-h-[380px] items-center justify-center p-10 text-center"><div><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 font-bold text-cyan-700">01</div><h3 className="mt-5 font-display text-xl font-bold">Run the first experiment</h3><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">The chart will show actual values, point forecasts, prediction bounds and regime boundaries.</p></div></div>}
      {result&&<div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">{[
          ["Coverage",`${(result.empirical_coverage*100).toFixed(1)}%`,`target ${(result.target_coverage*100).toFixed(0)}%`],
          ["Average width",result.average_width.toFixed(2),"smaller is more informative at comparable coverage"],
          ["Interval score",result.interval_score.toFixed(2),"lower is better"],
          ["Mean ESS",result.mean_ess.toFixed(1),"calibration reliability"]
        ].map(([a,b,c])=><div className="card p-5" key={a}><div className="text-xs font-bold uppercase tracking-wider text-slate-400">{a}</div><div className="mt-2 font-display text-2xl font-extrabold">{b}</div><div className="mt-1 text-xs text-slate-500">{c}</div></div>)}</div>
        <div className="card p-6"><div className="eyebrow">Forecast + uncertainty</div><h3 className="mt-1 font-display text-xl font-bold">Synthetic non-stationary benchmark</h3><div className="mt-5 h-[400px]"><ResponsiveContainer><LineChart data={result.points}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/><XAxis dataKey="t"/><YAxis/><Tooltip/><Legend/><Line dataKey="actual" stroke="#0f172a" dot={false} strokeWidth={2}/><Line dataKey="forecast" stroke="#0891b2" dot={false}/><Line dataKey="upper" stroke="#0e7490" dot={false}/><Line dataKey="lower" stroke="#0e7490" dot={false}/></LineChart></ResponsiveContainer></div></div>
      </div>}</div>
    </div>
  </Page>;
}

// function Ablations() {
//   const [data,setData]=useState([]);
//   useEffect(()=>{getAblation().then(setData)},[]);
//   return <Page><Section eyebrow="04 · Ablation study" title="Does each proposed idea actually matter?">Ablation removes one component at a time. The final thesis should replace these demo values with controlled experimental results.</Section>
//     <div className="card mt-10 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-400"><tr><th className="p-5">Variant</th><th>Coverage</th><th>Width</th><th>Score</th><th>ESS</th></tr></thead><tbody>{data.map(r=><tr className="border-t" key={r.name}><td className="p-5 font-semibold">{r.name}</td><td>{(r.coverage*100).toFixed(1)}%</td><td>{r.width.toFixed(2)}</td><td>{r.score.toFixed(2)}</td><td>{r.ess.toFixed(1)}</td></tr>)}</tbody></table></div>
//     <div className="card mt-6 p-6"><div className="eyebrow">Why this matters</div><p className="mt-3 text-sm leading-7 text-slate-600">N1 tests regime information, N2 tests local geometry, N3 tests adaptive bandwidth and N4 tests whether the reliability safeguard prevents pathological over-localization.</p></div>
//   </Page>;
// }


function Ablations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getAblation()
      .then((result) => {
        setData(result);
      })
      .catch(() => {
        setError("Unable to load ablation results. Please check the backend.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Page>
      <Section
        eyebrow="04 · Ablation study"
        title="Does each proposed idea actually matter?"
      >
        Ablation removes one component at a time. The final thesis should
        replace these demo values with controlled experimental results.
      </Section>

      {/* Loading state */}
      {loading && (
        <div className="card mt-10 flex min-h-[300px] flex-col items-center justify-center p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-50">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-600" />
          </div>

          <h3 className="mt-5 font-display text-lg font-bold text-slate-800">
            Loading ablation results...
          </h3>

          <p className="mt-2 max-w-sm text-center text-sm leading-6 text-slate-500">
            The backend is retrieving the results for each ablation variant.
            This may take a moment.
          </p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="font-display font-bold text-red-800">
            Unable to load results
          </div>

          <p className="mt-2 text-sm leading-6 text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          <div className="card mt-10 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="p-5">Variant</th>
                  <th>Coverage</th>
                  <th>Width</th>
                  <th>Score</th>
                  <th>ESS</th>
                </tr>
              </thead>

              <tbody>
                {data.map((r) => (
                  <tr className="border-t" key={r.name}>
                    <td className="p-5 font-semibold">
                      {r.name}
                    </td>

                    <td>
                      {(r.coverage * 100).toFixed(1)}%
                    </td>

                    <td>
                      {r.width.toFixed(2)}
                    </td>

                    <td>
                      {r.score.toFixed(2)}
                    </td>

                    <td>
                      {r.ess.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Explanation */}
          <div className="card mt-6 p-6">
            <div className="eyebrow">
              Why this matters
            </div>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              N1 tests regime information, N2 tests local geometry,
              N3 tests adaptive bandwidth and N4 tests whether the
              reliability safeguard prevents pathological
              over-localization.
            </p>
          </div>
        </>
      )}
    </Page>
  );
}


function Theory() {
  return <Page><Section eyebrow="05 · Mathematics" title="The mathematical core">This page provides the professor a compact route from forecast errors to weighted conformal calibration.</Section>
    <div className="mt-10 space-y-5">{[
      ["Nonconformity score","rᵢ = |yᵢ − ŷᵢ|"],
      ["Lag-state","zₜ = [yₜ, yₜ₋₁, …, yₜ₋ₚ₊₁, Δyₜ, Δ²yₜ]"],
      ["Geometry","dᵢ = √((zₜ − zᵢ)ᵀΣ⁻¹(zₜ − zᵢ))"],
      ["Combined weight","wᵢ ∝ (wᵢᴿ)^γ¹ (wᵢᴳ)^γ² (wᵢᵀ)^γ³"],
      ["Prediction interval","Cₜ = [ŷₜ − qₜ, ŷₜ + qₜ]"],
      ["Coverage","Coverage = (1/T) Σₜ I(yₜ ∈ Cₜ)"]
    ].map(([t,m])=><div className="card p-6" key={t}><div className="eyebrow">{t}</div><Math>{m}</Math></div>)}</div>
    <div className="mt-10 grid gap-4 md:grid-cols-2">{[
      ["Coverage","How often the true value lies inside the interval."],
      ["Average width","How wide the uncertainty interval is."],
      ["Interval score","Combines interval width and penalties for misses."],
      ["Effective sample size","How many observations effectively influence weighted calibration."]
    ].map(([t,d])=><div className="card p-6" key={t}><h3 className="font-display font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{d}</p></div>)}</div>
  </Page>;
}

function Literature() {
  const [papers,setPapers]=useState([]),[q,setQ]=useState("");
  useEffect(()=>{getLiterature().then(setPapers)},[]);
  const shown=papers.filter(p=>`${p.title} ${p.authors} ${p.why}`.toLowerCase().includes(q.toLowerCase()));
  return <Page><Section eyebrow="06 · Literature" title="The research landscape behind the thesis">Closest methods are shown explicitly so the project does not accidentally present an existing method as novel.</Section>
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search papers…" className="mt-8 w-full rounded-xl border bg-white p-3 text-sm outline-none focus:border-cyan-600"/>
    <div className="mt-6 space-y-4">{shown.map(p=><article className="card p-6" key={p.title}><div className="flex flex-col justify-between gap-4 md:flex-row"><div><div className="text-xs font-bold uppercase tracking-wider text-cyan-700">{p.year} · {p.venue} · {p.tag}</div><h3 className="mt-2 font-display text-xl font-bold">{p.title}</h3><p className="mt-1 text-sm text-slate-500">{p.authors}</p></div><a href={p.url} target="_blank" rel="noreferrer" className="btn-secondary self-start">Open paper <ExternalLink size={15} className="ml-2"/></a></div><p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">{p.why}</p></article>)}</div>
  </Page>;
}

export default function App() {
  return <Layout><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/problem" element={<Problem/>}/>
    <Route path="/method" element={<Method/>}/>
    <Route path="/experiments" element={<Experiments/>}/>
    <Route path="/ablations" element={<Ablations/>}/>
    <Route path="/theory" element={<Theory/>}/>
    <Route path="/literature" element={<Literature/>}/>
  </Routes></Layout>;
}
