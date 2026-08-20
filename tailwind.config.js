/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./public/js/**/*.js"
  ],
  safelist: [
    { pattern: /^eco-(A|B|C)$/ },
    { pattern: /^bg-(forest|cream|gold)-(50|100|200|300|400|500|600|700|800|900|950)\/?\d*$/ },
    { pattern: /^text-(forest|cream|gold)-(50|100|200|300|400|500|600|700|800|900|950)\/?\d*$/ },
    { pattern: /^border-(forest|cream|gold)-(50|100|200|300|400|500|600|700|800|900|950)\/?\d*$/ },
  ],
  theme: {
    extend: {
      colors: {
        forest: { 50:'#f0f5f1',100:'#dae8df',200:'#b5d0bf',300:'#86b094',400:'#588a6b',500:'#3a6d4d',600:'#2a5a3d',700:'#1f4530',800:'#1a3a2e',900:'#0f2a1f',950:'#081811' },
        cream:  { 50:'#fefdfa',100:'#fdf8f0',200:'#faf2e3',300:'#f5e8cf',400:'#ecd9b3',500:'#e0c490' },
        gold:   { 50:'#fdf8ef',100:'#faecd1',200:'#f4d79e',300:'#edbc63',400:'#e6a73c',500:'#d4a574',600:'#c19660',700:'#a07a48',800:'#83623c',900:'#6c5234' }
      },
      fontFamily: { sans: ['Inter','system-ui','sans-serif'], display: ['Fraunces','Inter','serif'] }
    }
  },
  plugins: []
}
