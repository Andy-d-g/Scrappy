
let txt = '* { box-sizing: border-box; }'

let test = "*, ::after, ::before { box-sizing: border-box; }"

let t  = `@media (prefers-reduced-motion: no-preference) { :root { scroll-behavior: smooth; color: blue; } text-align: center }`

let v = `:root {
    --bs-blue: #0d6efd;
    --bs-indigo: #6610f2;
    --bs-purple: #6f42c1;
    --bs-pink: #d63384;
    --bs-red: #dc3545;
    --bs-orange: #fd7e14;
    --bs-yellow: #ffc107;
    --bs-green: #198754;
    --bs-teal: #20c997;
    --bs-cyan: #0dcaf0;
    --bs-white: #fff;
    --bs-gray: #6c757d;
    --bs-gray-dark: #343a40;
    --bs-gray-100: #f8f9fa;
    --bs-gray-200: #e9ecef;
    --bs-gray-300: #dee2e6;
    --bs-gray-400: #ced4da;
    --bs-gray-500: #adb5bd;
    --bs-gray-600: #6c757d;
    --bs-gray-700: #495057;
    --bs-gray-800: #343a40;
    --bs-gray-900: #212529;
    --bs-primary: #0d6efd;
    --bs-secondary: #6c757d;
    --bs-success: #198754;
    --bs-info: #0dcaf0;
    --bs-warning: #ffc107;
    --bs-danger: #dc3545;
    --bs-light: #f8f9fa;
    --bs-dark: #212529;
    --bs-primary-rgb: 13, 110, 253;
    --bs-secondary-rgb: 108, 117, 125;
    --bs-success-rgb: 25, 135, 84;
    --bs-info-rgb: 13, 202, 240;
    --bs-warning-rgb: 255, 193, 7;
    --bs-danger-rgb: 220, 53, 69;
    --bs-light-rgb: 248, 249, 250;
    --bs-dark-rgb: 33, 37, 41;
    --bs-white-rgb: 255, 255, 255;
    --bs-black-rgb: 0, 0, 0;
    --bs-body-color-rgb: 33, 37, 41;
    --bs-body-bg-rgb: 255, 255, 255;
    --bs-font-sans-serif: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --bs-font-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --bs-gradient: linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
    --bs-body-font-family: var(--bs-font-sans-serif);
    --bs-body-font-size: 1rem;
    --bs-body-font-weight: 400;
    --bs-body-line-height: 1.5;
    --bs-body-color: #212529;
    --bs-body-bg: #fff
}
`

let w  = `@media (min-width:1200px) {
    .h1,
    h1 {
        font-size: 2.5rem
    }
}`

let a = `abbr[data-bs-original-title],
abbr[title] {
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
    cursor: help;
    -webkit-text-decoration-skip-ink: none;
    text-decoration-skip-ink: none
}`

let e = `a:not([href]):not([class]),a:not([href]):not([class]):hover {color: inherit; text-decoration: none }`

let u  = `.ql-editor ul[data-checked=true] > li::before,
.ql-editor ul[data-checked=false] > li::before {
  color: #777;
  cursor: pointer;
  pointer-events: all;
}
a:not([href]):not([class]),a:not([href]):not([class]):hover {color: inherit; text-decoration: none }`

let o = `.ql-editor ol li.ql-indent-4:before {
    content: counter(list-4, lower-alpha) '. ';
}`

let p = `.ql-editor li.ql-indent-3:not(.ql-direction-rtl) {
    padding-left: 10.5em;
  }`

let mp = `.ql-bubble.ql-toolbar button:hover .ql-stroke,
.ql-bubble .ql-toolbar button:hover .ql-stroke,
.ql-bubble.ql-toolbar button:focus .ql-stroke,
.ql-bubble .ql-toolbar button:focus .ql-stroke,
.ql-bubble.ql-toolbar button.ql-active .ql-stroke,
.ql-bubble .ql-toolbar button.ql-active .ql-stroke,
.ql-bubble.ql-toolbar .ql-picker-label:hover .ql-stroke,
.ql-bubble .ql-toolbar .ql-picker-label:hover .ql-stroke,
.ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
.ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
.ql-bubble.ql-toolbar .ql-picker-item:hover .ql-stroke,
.ql-bubble .ql-toolbar .ql-picker-item:hover .ql-stroke,
.ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
.ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
.ql-bubble.ql-toolbar button:hover .ql-stroke-miter,
.ql-bubble .ql-toolbar button:hover .ql-stroke-miter,
.ql-bubble.ql-toolbar button:focus .ql-stroke-miter,
.ql-bubble .ql-toolbar button:focus .ql-stroke-miter,
.ql-bubble.ql-toolbar button.ql-active .ql-stroke-miter,
.ql-bubble .ql-toolbar button.ql-active .ql-stroke-miter,
.ql-bubble.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
.ql-bubble .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
.ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
.ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
.ql-bubble.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
.ql-bubble .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
.ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
.ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
  stroke: #fff;
}`

let sp = `@media (pointer: coarse) {
    .ql-bubble.ql-toolbar button:hover:not(.ql-active),
    .ql-bubble .ql-toolbar button:hover:not(.ql-active) {
      color: #ccc;
    }
    .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-fill,
    .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-fill,
    .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill,
    .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill {
      fill: #ccc;
    }
    .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-stroke,
    .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-stroke,
    .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter,
    .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter {
      stroke: #ccc;
    }
  }`

let select = `.ql-bubble.ql-toolbar button:hover:not(.ql-active),    .ql-bubble .ql-toolbar button:hover:not(.ql-active)`

let st = '.h1,    h1'

let xy = '  .h1, h1 { font-size: 2.5rem; }\n' +
'} .h2, h2 { font-size: calc(1.325rem + 0.9vw); } @media (min-width: 1200px) {\n' +
'  .h2, h2 { font-size: 2rem; }\n' +
'}'


let peo = "@font-face { font-family: swiper-icons; src: url(\"data:application/font-woff;charset=utf-8;base64, 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)"

let xpe = `@font-face { src: url(\"data:application/font-woff;charset=utf-8;base64, AO8EFTQAA\"); }`

let xpr = `#hero {
  width: 100%;
  height: 75vh;
  background: url("../img/hero-bg.jpg") top left;
  background-size: cover;
  position: relative;
}`