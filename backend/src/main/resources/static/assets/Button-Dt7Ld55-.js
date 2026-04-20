import{j as e}from"./index-CYLByLo8.js";const c=({children:a,onClick:b,type:n="button",variant:d="primary",className:i="",disabled:t=!1,loading:r=!1,icon:o})=>{const s={primary:"bg-[#8B2E2E] hover:bg-[#6F2323] text-white border border-[#8B2E2E]",secondary:"bg-white hover:bg-[#F7F7F7] text-[#8B2E2E] border border-[#8B2E2E]",outline:"bg-white hover:bg-[#F7F7F7] border border-[#E5E5E5] text-[#2F2F2F]",ghost:"bg-transparent hover:bg-[#F7F7F7] text-[#6B7280] hover:text-[#2F2F2F]",danger:"bg-[#6F2323] hover:bg-[#5A1C1C] text-white border border-[#6F2323]",neutral:"bg-white hover:bg-[#F7F7F7] border border-[#D1D5DB] text-[#374151]"};return e.jsxs("button",{type:n,onClick:b,disabled:t||r,className:`
                px-5 py-2.5 rounded-md font-semibold transition-colors active:scale-[0.99] flex items-center justify-center gap-2
                ${s[d]||s.primary}
                ${t||r?"opacity-50 cursor-not-allowed":""}
                ${i}
            `,children:[r&&e.jsx("div",{className:"w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"}),!r&&o&&e.jsx("span",{className:"text-lg",children:o}),a]})};export{c as B};
