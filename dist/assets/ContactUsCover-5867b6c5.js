import{a as u,r as i,s as x,at as b,u as o,j as a,b as e,L as c,D as f,F as w,d as N,au as v,c as k,e as y,av as n}from"./index-0a09aeff.js";import{I as C}from"./IconPhoneCall-1831c0eb.js";import{I as j}from"./IconPencil-baa8beb1.js";import{I}from"./IconMessageDots-b9ff4b53.js";import"react-quill/dist/quill.snow.css";const P=()=>{const s=u();i.useEffect(()=>{s(x("Contact Us Cover"))});const d=b(),m=o(t=>t.themeConfig.rtlClass)==="rtl",r=o(t=>t.themeConfig),g=t=>{p(t),t.toLowerCase()==="ae"?s(n("rtl")):s(n("ltr"))},[l,p]=i.useState(r.locale),h=()=>{d("/")};return a("div",{children:[e("div",{className:"absolute inset-0",children:e("img",{src:"/assets/images/auth/bg-gradient.png",alt:"image",className:"h-full w-full object-cover"})}),a("div",{className:"relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16",children:[e("img",{src:"/assets/images/auth/coming-soon-object1.png",alt:"image",className:"absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2"}),e("img",{src:"/assets/images/auth/coming-soon-object2.png",alt:"image",className:"absolute left-24 top-0 h-40 md:left-[30%]"}),e("img",{src:"/assets/images/auth/coming-soon-object3.png",alt:"image",className:"absolute right-0 top-0 h-[300px]"}),e("img",{src:"/assets/images/auth/polygon-object.svg",alt:"image",className:"absolute bottom-0 end-[28%]"}),a("div",{className:"relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0",children:[a("div",{className:"relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]",children:[e("div",{className:"absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"}),a("div",{className:"ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]",children:[e(c,{to:"/",className:"w-48 block lg:w-72 ms-10",children:e("img",{src:"/assets/images/auth/logo-white.svg",alt:"Logo",className:"w-full"})}),e("div",{className:"mt-24 hidden w-full max-w-[430px] lg:block",children:e("img",{src:"/assets/images/auth/contact-us.svg",alt:"Cover Image",className:"w-full"})})]})]}),a("div",{className:"relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]",children:[a("div",{className:"flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full",children:[e(c,{to:"/",className:"w-8 block lg:hidden",children:e("img",{src:"/assets/images/logo.svg",alt:"Logo",className:"mx-auto w-10"})}),e("div",{className:"dropdown ms-auto w-max",children:e(f,{offset:[0,8],placement:`${m?"bottom-start":"bottom-end"}`,btnClassName:"flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black",button:a(w,{children:[e("div",{children:e("img",{src:`/assets/images/flags/${l.toUpperCase()}.svg`,alt:"image",className:"h-5 w-5 rounded-full object-cover"})}),e("div",{className:"text-base font-bold uppercase",children:l}),e("span",{className:"shrink-0",children:e(N,{})})]}),children:e("ul",{className:"!px-2 text-dark dark:text-white-dark grid grid-cols-2 gap-2 font-semibold dark:text-white-light/90 w-[280px]",children:r.languageList.map(t=>e("li",{children:a("button",{type:"button",className:`flex w-full hover:text-primary rounded-lg ${l===t.code?"bg-primary/10 text-primary":""}`,onClick:()=>{v.changeLanguage(t.code),g(t.code)},children:[e("img",{src:`/assets/images/flags/${t.code.toUpperCase()}.svg`,alt:"flag",className:"w-5 h-5 object-cover rounded-full"}),e("span",{className:"ltr:ml-3 rtl:mr-3",children:t.name})]})},t.code))})})})]}),a("div",{className:"w-full max-w-[440px] lg:mt-16",children:[a("div",{className:"mb-10",children:[e("h1",{className:"text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl",children:"Contact us"}),e("p",{className:"text-base font-bold leading-normal text-white-dark",children:"Submit your queries and we will get back to you as soon as possible."})]}),a("form",{className:"space-y-5",onSubmit:h,children:[a("div",{className:"relative text-white-dark",children:[e("input",{id:"Name",type:"text",placeholder:"Name",className:"form-input ps-10 placeholder:text-white-dark"}),e("span",{className:"absolute start-4 top-1/2 -translate-y-1/2",children:e(k,{fill:!0})})]}),a("div",{className:"relative text-white-dark",children:[e("input",{id:"Email",type:"email",placeholder:"Email",className:"form-input ps-10 placeholder:text-white-dark"}),e("span",{className:"absolute start-4 top-1/2 -translate-y-1/2",children:e(y,{fill:!0})})]}),a("div",{className:"relative text-white-dark",children:[e("input",{id:"Phone",type:"text",placeholder:"Phone",className:"form-input ps-10 placeholder:text-white-dark"}),e("span",{className:"absolute start-4 top-1/2 -translate-y-1/2",children:e(C,{fill:!0})})]}),a("div",{className:"relative text-white-dark",children:[e("input",{id:"Subject",type:"text",placeholder:"Subject",className:"form-input ps-10 placeholder:text-white-dark"}),e("span",{className:"absolute start-4 top-1/2 -translate-y-1/2",children:e(j,{fill:!0})})]}),a("div",{className:"relative text-white-dark",children:[e("textarea",{id:"Textarea",rows:4,className:"form-textarea resize-none ps-10 placeholder:text-white-dark",placeholder:"Message"}),e("span",{className:"absolute start-4 top-2.5",children:e(I,{fill:!0})})]}),e("button",{type:"submit",className:"btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]",children:"Submit"})]})]}),a("p",{className:"absolute bottom-6 w-full text-center dark:text-white",children:["© ",new Date().getFullYear(),".VRISTO All Rights Reserved."]})]})]})]})]})};export{P as default};
