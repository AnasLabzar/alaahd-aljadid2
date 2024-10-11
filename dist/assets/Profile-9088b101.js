import{a as c,r as n,s as m,u as o,j as t,b as e,L as s,m as h,e as b,D as r}from"./index-0a09aeff.js";import{I as f}from"./IconPencilPaper-42fc879c.js";import{I as x,a as u,b as N}from"./IconShoppingBag-0748bd2b.js";import{I as p}from"./IconMapPin-51899b43.js";import{I as g}from"./IconPhone-6b01a81c.js";import{I as w}from"./IconTwitter-90252d35.js";import{I as k}from"./IconGithub-d19f7124.js";import{I as v}from"./IconTag-03a1929f.js";import{I as y}from"./IconCreditCard-b20fec59.js";import{I as j}from"./IconClock-1457b866.js";import{I as a}from"./IconHorizontalDots-0d4d458f.js";import"react-quill/dist/quill.snow.css";const U=()=>{const i=c();n.useEffect(()=>{i(m("Profile"))});const l=o(d=>d.themeConfig.rtlClass)==="rtl";return t("div",{children:[t("ul",{className:"flex space-x-2 rtl:space-x-reverse",children:[e("li",{children:e(s,{to:"#",className:"text-primary hover:underline",children:"Users"})}),e("li",{className:"before:content-['/'] ltr:before:mr-2 rtl:before:ml-2",children:e("span",{children:"Profile"})})]}),t("div",{className:"pt-5",children:[t("div",{className:"grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-5",children:[t("div",{className:"panel",children:[t("div",{className:"flex items-center justify-between mb-5",children:[e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Profile"}),e(s,{to:"/users/user-account-settings",className:"ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full",children:e(f,{})})]}),t("div",{className:"mb-5",children:[t("div",{className:"flex flex-col justify-center items-center",children:[e("img",{src:"/assets/images/profile-34.jpeg",alt:"img",className:"w-24 h-24 rounded-full object-cover  mb-5"}),e("p",{className:"font-semibold text-primary text-xl",children:"Jimmy Turner"})]}),t("ul",{className:"mt-5 flex flex-col max-w-[160px] m-auto space-y-4 font-semibold text-white-dark",children:[t("li",{className:"flex items-center gap-2",children:[e(x,{className:"shrink-0"}),"Web Developer"]}),t("li",{className:"flex items-center gap-2",children:[e(h,{className:"shrink-0"}),"Jan 20, 1989"]}),t("li",{className:"flex items-center gap-2",children:[e(p,{className:"shrink-0"}),"New York, USA"]}),e("li",{children:t("button",{className:"flex items-center gap-2",children:[e(b,{className:"w-5 h-5 shrink-0"}),e("span",{className:"text-primary truncate",children:"jimmy@gmail.com"})]})}),t("li",{className:"flex items-center gap-2",children:[e(g,{}),e("span",{className:"whitespace-nowrap",dir:"ltr",children:"+1 (530) 555-12121"})]})]}),t("ul",{className:"mt-7 flex items-center justify-center gap-2",children:[e("li",{children:e("button",{className:"btn btn-info flex items-center justify-center rounded-full w-10 h-10 p-0",children:e(w,{className:"w-5 h-5"})})}),e("li",{children:e("button",{className:"btn btn-danger flex items-center justify-center rounded-full w-10 h-10 p-0",children:e(u,{})})}),e("li",{children:e("button",{className:"btn btn-dark flex items-center justify-center rounded-full w-10 h-10 p-0",children:e(k,{})})})]})]})]}),t("div",{className:"panel lg:col-span-2 xl:col-span-3",children:[e("div",{className:"mb-5",children:e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Task"})}),e("div",{className:"mb-5",children:e("div",{className:"table-responsive text-[#515365] dark:text-white-light font-semibold",children:t("table",{className:"whitespace-nowrap",children:[e("thead",{children:t("tr",{children:[e("th",{children:"Projects"}),e("th",{children:"Progress"}),e("th",{children:"Task Done"}),e("th",{className:"text-center",children:"Time"})]})}),t("tbody",{className:"dark:text-white-dark",children:[t("tr",{children:[e("td",{children:"Figma Design"}),e("td",{children:e("div",{className:"h-1.5 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex w-full",children:e("div",{className:"bg-danger rounded-full w-[29.56%]"})})}),e("td",{className:"text-danger",children:"29.56%"}),e("td",{className:"text-center",children:"2 mins ago"})]}),t("tr",{children:[e("td",{children:"Vue Migration"}),e("td",{children:e("div",{className:"h-1.5 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex w-full",children:e("div",{className:"bg-info rounded-full w-1/2"})})}),e("td",{className:"text-success",children:"50%"}),e("td",{className:"text-center",children:"4 hrs ago"})]}),t("tr",{children:[e("td",{children:"Flutter App"}),e("td",{children:e("div",{className:"h-1.5 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex w-full",children:e("div",{className:"bg-warning rounded-full  w-[39%]"})})}),e("td",{className:"text-danger",children:"39%"}),e("td",{className:"text-center",children:"a min ago"})]}),t("tr",{children:[e("td",{children:"API Integration"}),e("td",{children:e("div",{className:"h-1.5 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex w-full",children:e("div",{className:"bg-success rounded-full  w-[78.03%]"})})}),e("td",{className:"text-success",children:"78.03%"}),e("td",{className:"text-center",children:"2 weeks ago"})]}),t("tr",{children:[e("td",{children:"Blog Update"}),e("td",{children:e("div",{className:"h-1.5 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex w-full",children:e("div",{className:"bg-secondary  rounded-full  w-full"})})}),e("td",{className:"text-success",children:"100%"}),e("td",{className:"text-center",children:"18 hrs ago"})]}),t("tr",{children:[e("td",{children:"Landing Page"}),e("td",{children:e("div",{className:"h-1.5 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex w-full",children:e("div",{className:"bg-danger rounded-full  w-[19.15%]"})})}),e("td",{className:"text-danger",children:"19.15%"}),e("td",{className:"text-center",children:"5 days ago"})]}),t("tr",{children:[e("td",{children:"Shopify Dev"}),e("td",{children:e("div",{className:"h-1.5 bg-[#ebedf2] dark:bg-dark/40 rounded-full flex w-full",children:e("div",{className:"bg-primary rounded-full w-[60.55%]"})})}),e("td",{className:"text-success",children:"60.55%"}),e("td",{className:"text-center",children:"8 days ago"})]})]})]})})})]})]}),t("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-5",children:[t("div",{className:"panel",children:[e("div",{className:"mb-5",children:e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Summary"})}),t("div",{className:"space-y-4",children:[e("div",{className:"border border-[#ebedf2] rounded dark:bg-[#1b2e4b] dark:border-0",children:t("div",{className:"flex items-center justify-between p-4 py-2",children:[e("div",{className:"grid place-content-center w-9 h-9 rounded-md bg-secondary-light dark:bg-secondary text-secondary dark:text-secondary-light",children:e(N,{})}),t("div",{className:"ltr:ml-4 rtl:mr-4 flex items-start justify-between flex-auto font-semibold",children:[t("h6",{className:"text-white-dark text-[13px] dark:text-white-dark",children:["Income",e("span",{className:"block text-base text-[#515365] dark:text-white-light",children:"$92,600"})]}),e("p",{className:"ltr:ml-auto rtl:mr-auto text-secondary",children:"90%"})]})]})}),e("div",{className:"border border-[#ebedf2] rounded dark:bg-[#1b2e4b] dark:border-0",children:t("div",{className:"flex items-center justify-between p-4 py-2",children:[e("div",{className:"grid place-content-center w-9 h-9 rounded-md bg-info-light dark:bg-info text-info dark:text-info-light",children:e(v,{})}),t("div",{className:"ltr:ml-4 rtl:mr-4 flex items-start justify-between flex-auto font-semibold",children:[t("h6",{className:"text-white-dark text-[13px] dark:text-white-dark",children:["Profit",e("span",{className:"block text-base text-[#515365] dark:text-white-light",children:"$37,515"})]}),e("p",{className:"ltr:ml-auto rtl:mr-auto text-info",children:"65%"})]})]})}),e("div",{className:"border border-[#ebedf2] rounded dark:bg-[#1b2e4b] dark:border-0",children:t("div",{className:"flex items-center justify-between p-4 py-2",children:[e("div",{className:"grid place-content-center w-9 h-9 rounded-md bg-warning-light dark:bg-warning text-warning dark:text-warning-light",children:e(y,{})}),t("div",{className:"ltr:ml-4 rtl:mr-4 flex items-start justify-between flex-auto font-semibold",children:[t("h6",{className:"text-white-dark text-[13px] dark:text-white-dark",children:["Expenses",e("span",{className:"block text-base text-[#515365] dark:text-white-light",children:"$55,085"})]}),e("p",{className:"ltr:ml-auto rtl:mr-auto text-warning",children:"80%"})]})]})})]})]}),t("div",{className:"panel",children:[t("div",{className:"flex items-center justify-between mb-10",children:[e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Pro Plan"}),e("button",{className:"btn btn-primary",children:"Renew Now"})]}),t("div",{className:"group",children:[t("ul",{className:"list-inside list-disc text-white-dark font-semibold mb-7 space-y-2",children:[e("li",{children:"10,000 Monthly Visitors"}),e("li",{children:"Unlimited Reports"}),e("li",{children:"2 Years Data Storage"})]}),t("div",{className:"flex items-center justify-between mb-4 font-semibold",children:[t("p",{className:"flex items-center rounded-full bg-dark px-2 py-1 text-xs text-white-light font-semibold",children:[e(j,{className:"w-3 h-3 ltr:mr-1 rtl:ml-1"}),"5 Days Left"]}),e("p",{className:"text-info",children:"$25 / month"})]}),e("div",{className:"rounded-full h-2.5 p-0.5 bg-dark-light overflow-hidden mb-5 dark:bg-dark-light/10",children:e("div",{className:"bg-gradient-to-r from-[#f67062] to-[#fc5296] w-full h-full rounded-full relative",style:{width:"65%"}})})]})]}),t("div",{className:"panel",children:[e("div",{className:"flex items-center justify-between mb-5",children:e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Payment History"})}),t("div",{children:[e("div",{className:"border-b border-[#ebedf2] dark:border-[#1b2e4b]",children:t("div",{className:"flex items-center justify-between py-2",children:[t("h6",{className:"text-[#515365] font-semibold dark:text-white-dark",children:["March",e("span",{className:"block text-white-dark dark:text-white-light",children:"Pro Membership"})]}),t("div",{className:"flex items-start justify-between ltr:ml-auto rtl:mr-auto",children:[e("p",{className:"font-semibold",children:"90%"}),e("div",{className:"dropdown ltr:ml-4 rtl:mr-4",children:e(r,{offset:[0,5],placement:`${l?"bottom-start":"bottom-end"}`,btnClassName:"hover:text-primary",button:e(a,{className:"opacity-80 hover:opacity-100"}),children:t("ul",{className:"!min-w-[150px]",children:[e("li",{children:e("button",{type:"button",children:"View Invoice"})}),e("li",{children:e("button",{type:"button",children:"Download Invoice"})})]})})})]})]})}),e("div",{className:"border-b border-[#ebedf2] dark:border-[#1b2e4b]",children:t("div",{className:"flex items-center justify-between py-2",children:[t("h6",{className:"text-[#515365] font-semibold dark:text-white-dark",children:["February",e("span",{className:"block text-white-dark dark:text-white-light",children:"Pro Membership"})]}),t("div",{className:"flex items-start justify-between ltr:ml-auto rtl:mr-auto",children:[e("p",{className:"font-semibold",children:"90%"}),e("div",{className:"dropdown ltr:ml-4 rtl:mr-4",children:e(r,{offset:[0,5],placement:`${l?"bottom-start":"bottom-end"}`,button:e(a,{className:"opacity-80 hover:opacity-100"}),children:t("ul",{className:"!min-w-[150px]",children:[e("li",{children:e("button",{type:"button",children:"View Invoice"})}),e("li",{children:e("button",{type:"button",children:"Download Invoice"})})]})})})]})]})}),e("div",{children:t("div",{className:"flex items-center justify-between py-2",children:[t("h6",{className:"text-[#515365] font-semibold dark:text-white-dark",children:["January",e("span",{className:"block text-white-dark dark:text-white-light",children:"Pro Membership"})]}),t("div",{className:"flex items-start justify-between ltr:ml-auto rtl:mr-auto",children:[e("p",{className:"font-semibold",children:"90%"}),e("div",{className:"dropdown ltr:ml-4 rtl:mr-4",children:e(r,{offset:[0,5],placement:`${l?"bottom-start":"bottom-end"}`,button:e(a,{className:"opacity-80 hover:opacity-100"}),children:t("ul",{className:"!min-w-[150px]",children:[e("li",{children:e("button",{type:"button",children:"View Invoice"})}),e("li",{children:e("button",{type:"button",children:"Download Invoice"})})]})})})]})]})})]})]}),t("div",{className:"panel",children:[e("div",{className:"flex items-center justify-between mb-5",children:e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Card Details"})}),t("div",{children:[e("div",{className:"border-b border-[#ebedf2] dark:border-[#1b2e4b]",children:t("div",{className:"flex items-center justify-between py-2",children:[e("div",{className:"flex-none",children:e("img",{src:"/assets/images/card-americanexpress.svg",alt:"img"})}),t("div",{className:"flex items-center justify-between flex-auto ltr:ml-4 rtl:mr-4",children:[t("h6",{className:"text-[#515365] font-semibold dark:text-white-dark",children:["American Express",e("span",{className:"block text-white-dark dark:text-white-light",children:"Expires on 12/2025"})]}),e("span",{className:"badge bg-success ltr:ml-auto rtl:mr-auto",children:"Primary"})]})]})}),e("div",{className:"border-b border-[#ebedf2] dark:border-[#1b2e4b]",children:t("div",{className:"flex items-center justify-between py-2",children:[e("div",{className:"flex-none",children:e("img",{src:"/assets/images/card-mastercard.svg",alt:"img"})}),e("div",{className:"flex items-center justify-between flex-auto ltr:ml-4 rtl:mr-4",children:t("h6",{className:"text-[#515365] font-semibold dark:text-white-dark",children:["Mastercard",e("span",{className:"block text-white-dark dark:text-white-light",children:"Expires on 03/2025"})]})})]})}),e("div",{children:t("div",{className:"flex items-center justify-between py-2",children:[e("div",{className:"flex-none",children:e("img",{src:"/assets/images/card-visa.svg",alt:"img"})}),e("div",{className:"flex items-center justify-between flex-auto ltr:ml-4 rtl:mr-4",children:t("h6",{className:"text-[#515365] font-semibold dark:text-white-dark",children:["Visa",e("span",{className:"block text-white-dark dark:text-white-light",children:"Expires on 10/2025"})]})})]})})]})]})]})]})]})};export{U as default};
