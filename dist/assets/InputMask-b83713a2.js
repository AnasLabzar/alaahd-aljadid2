import{a as p,r as m,s as k,j as a,b as e,L as _}from"./index-0a09aeff.js";import{C as r}from"./Highlight-e7ea6153.js";import{M as t}from"./reactTextMask-55ed0322.js";import{I as f}from"./IconBell-43a5a216.js";import{I as i}from"./IconCode-e280ea86.js";import"react-quill/dist/quill.snow.css";const M=()=>{const n=p();m.useEffect(()=>{n(k("Input Mask"))});const[s,c]=m.useState([]),l=d=>{s.includes(d)?c(o=>o.filter(h=>h!==d)):c([...s,d])};return a("div",{children:[a("ul",{className:"flex space-x-2 rtl:space-x-reverse",children:[e("li",{children:e(_,{to:"#",className:"text-primary hover:underline",children:"Forms"})}),e("li",{className:"before:content-['/'] ltr:before:mr-2 rtl:before:ml-2",children:e("span",{children:"Input Mask"})})]}),a("div",{className:"pt-5 space-y-8 flex-1",id:"basic",children:[a("div",{className:"panel p-3 flex items-center text-primary overflow-x-auto whitespace-nowrap",children:[e("div",{className:"ring-2 ring-primary/30 rounded-full bg-primary text-white p-1.5 ltr:mr-3 rtl:ml-3",children:e(f,{})}),e("span",{className:"ltr:mr-3 rtl:ml-3",children:"Documentation: "}),e("a",{href:"https://www.npmjs.com/package/react-text-mask",target:"_blank",className:"block hover:underline",rel:"noreferrer",children:"https://www.npmjs.com/package/react-text-mask"})]}),a("div",{className:"grid xl:grid-cols-2 grid-cols-1 gap-6",children:[a("div",{className:"panel",children:[a("div",{className:"flex items-center justify-between mb-5",children:[e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Static Mask Basic"}),e("button",{type:"button",className:"font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600",onClick:()=>l("code1"),children:a("span",{className:"flex items-center",children:[e(i,{className:"me-2"}),"Code"]})})]}),a("div",{className:"mb-5",children:[a("p",{className:"text-white-dark mb-5",children:["Input mask are use with ",e("span",{className:"text-danger",children:"input"})," tags."]}),e("form",{children:a("fieldset",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[a("div",{children:[e("label",{htmlFor:"staticMask1",className:"text-white-dark",children:`mask="'##-#######'" (99-9999999)`}),e(t,{id:"staticMask1",type:"text",placeholder:"__-_______",className:"form-input",mask:[/[0-9]/,/[0-9]/,"-",/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/]})]}),a("div",{children:[e("label",{htmlFor:"staticMask2",className:"text-white-dark",children:`mask="'AA-####'" (aa-9999)`}),e(t,{id:"staticMask2",type:"text",placeholder:"__-____",className:"form-input",mask:[/[a-z]/,/[a-z]/,"-",/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/]})]})]})})]}),s.includes("code1")&&e(r,{children:e("pre",{className:"language-typescript",children:`import MaskedInput from 'react-text-mask';

<form>
    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="staticMask1" className="text-white-dark">
                mask="'##-#######'" (99-9999999)
            </label>
            <MaskedInput
                id="staticMask1"
                type="text"
                placeholder="__-_______"
                className="form-input"
                mask={[/[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
            />
        </div>
        <div>
            <label htmlFor="staticMask2" className="text-white-dark">
                mask="'AA-####'" (aa-9999)
            </label>
            <MaskedInput id="staticMask2" type="text" placeholder="__-____" className="form-input" mask={[/[a-z]/, /[a-z]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]} />
        </div>
    </fieldset>
</form>`})})]}),a("div",{className:"panel",children:[a("div",{className:"flex items-center justify-between mb-5",children:[e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Alternate masks"}),e("button",{type:"button",className:"font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600",onClick:()=>l("code2"),children:a("span",{className:"flex items-center",children:[e(i,{className:"me-2"}),"Code"]})})]}),e("div",{className:"mb-5",children:e("form",{children:a("fieldset",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[a("div",{children:[e("label",{htmlFor:"altnMask1",className:"text-white-dark",children:`mask="'##.#'" (99.9)`}),e(t,{id:"altnMask1",type:"text",placeholder:"__._",className:"form-input",mask:[/[0-9]/,/[0-9]/,".",/[0-9]/]})]}),a("div",{children:[e("label",{htmlFor:"altnMask2",className:"text-white-dark",children:`mask="'##.##'" (99.99)`}),e(t,{id:"altnMask2",type:"text",placeholder:"__.__",className:"form-input",mask:[/[0-9]/,/[0-9]/,".",/[0-9]/,/[0-9]/]})]})]})})}),s.includes("code2")&&e(r,{children:e("pre",{className:"language-typescript",children:`import MaskedInput from 'react-text-mask';

<form>
    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="altnMask1" className="text-white-dark">
                mask="'##.#'" (99.9)
            </label>
            <MaskedInput id="altnMask1" type="text" placeholder="__._" className="form-input" mask={[/[0-9]/, /[0-9]/, '.', /[0-9]/]} />
        </div>
        <div>
            <label htmlFor="altnMask2" className="text-white-dark">
                mask="'##.##'" (99.99)
            </label>
            <MaskedInput id="altnMask2" type="text" placeholder="__.__" className="form-input" mask={[/[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/]} />
        </div>
    </fieldset>
</form>`})})]}),a("div",{className:"panel",children:[a("div",{className:"flex items-center justify-between mb-5",children:[e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Dynamic Syntax"}),e("button",{type:"button",className:"font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600",onClick:()=>l("code3"),children:a("span",{className:"flex items-center",children:[e(i,{className:"me-2"}),"Code"]})})]}),e("div",{className:"mb-5",children:e("form",{children:a("fieldset",{className:"grid grid-cols-1 md:grid-cols-3 items-end gap-4",children:[a("div",{children:[a("label",{htmlFor:"dynamicMask1",className:"text-white-dark",children:[`mask="'#-AAA###'" (9-a`,"{1,3}","9","{1,3}",")"]}),e(t,{id:"dynamicMask1",type:"text",placeholder:"_-__",className:"form-input",mask:[/[0-9]/,"-",/[a-z]/,/[a-z]/,/[a-z]/,/[0-9]/,/[0-9]/,/[0-9]/]})]}),a("div",{children:[a("label",{htmlFor:"dynamicMask2",className:"text-white-dark",children:[`mask="'AA-####'" (aa-9`,"{1,4}",")"]}),e(t,{id:"dynamicMask2",type:"text",placeholder:"__-____",className:"form-input",mask:[/[a-z]/,/[a-z]/,"-",/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/]})]}),a("div",{children:[a("label",{htmlFor:"dynamicMask3",className:"text-white-dark",children:[`mask="'AA-##'" (aa-9`,"{1,2}",")"]}),e(t,{id:"dynamicMask3",type:"text",placeholder:"__-__",className:"form-input",mask:[/[a-z]/,/[a-z]/,"-",/[0-9]/,/[0-9]/]})]})]})})}),s.includes("code3")&&e(r,{children:e("pre",{className:"language-typescript",children:`import MaskedInput from 'react-text-mask';

<form>
    <fieldset className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
        <div>
            <label htmlFor="dynamicMask1" className="text-white-dark">
                mask="'#-AAA###'" (9-a{'{1,3}'}9{'{1,3}'})
            </label>
            <MaskedInput
                id="dynamicMask1"
                type="text"
                placeholder="_-__"
                className="form-input"
                mask={[/[0-9]/, '-', /[a-z]/, /[a-z]/, /[a-z]/, /[0-9]/, /[0-9]/, /[0-9]/]}
            />
        </div>
        <div>
            <label htmlFor="dynamicMask2" className="text-white-dark">
                mask="'AA-####'" (aa-9{'{1,4}'})
            </label>
            <MaskedInput id="dynamicMask2" type="text" placeholder="__-____" className="form-input" mask={[/[a-z]/, /[a-z]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]} />
        </div>
        <div>
            <label htmlFor="dynamicMask3" className="text-white-dark">
                mask="'AA-##'" (aa-9{'{1,2}'})
            </label>
            <MaskedInput id="dynamicMask3" type="text" placeholder="__-__" className="form-input" mask={[/[a-z]/, /[a-z]/, '-', /[0-9]/, /[0-9]/]} />
        </div>
    </fieldset>
</form>`})})]}),a("div",{className:"panel",children:[a("div",{className:"flex items-center justify-between mb-5",children:[e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Date"}),e("button",{type:"button",className:"font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600",onClick:()=>l("code4"),children:a("span",{className:"flex items-center",children:[e(i,{className:"me-2"}),"Code"]})})]}),e("div",{className:"mb-5",children:e("form",{children:a("fieldset",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[a("div",{children:[e("label",{htmlFor:"dateMask1",className:"text-white-dark",children:`mask="'##/##/####'" (dd/mm/yyyy)`}),e(t,{id:"dateMask1",type:"text",placeholder:"__/__/____",className:"form-input",mask:[/[0-9]/,/[0-9]/,"/",/[0-9]/,/[0-9]/,"/",/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/]})]}),a("div",{children:[e("label",{htmlFor:"dateMask2",className:"text-white-dark",children:`mask="'##-##-####'" (99-99-9999)`}),e(t,{id:"dateMask2",type:"text",placeholder:"__-__-____",className:"form-input",mask:[/[0-9]/,/[0-9]/,"-",/[0-9]/,/[0-9]/,"-",/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/]})]}),a("div",{children:[e("label",{htmlFor:"dateMask3",className:"text-white-dark",children:`mask="'## December, ####'" (99 December, 9999)`}),e(t,{id:"dateMask3",type:"text",placeholder:"__ December, ____",className:"form-input",mask:[/[0-9]/,/[0-9]/," ","D","e","c","e","m","b","e","r"," ",/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/]})]})]})})}),s.includes("code4")&&e(r,{children:e("pre",{className:"language-typescript",children:`import MaskedInput from 'react-text-mask';

<form>
    <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
            <label htmlFor="dateMask1" className="text-white-dark">
                mask="'##/##/####'" (dd/mm/yyyy)
            </label>
            <MaskedInput
                id="dateMask1"
                type="text"
                placeholder="__/__/____"
                className="form-input"
                mask={[/[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
            />
        </div>
        <div>
            <label htmlFor="dateMask2" className="text-white-dark">
                mask="'##-##-####'" (99-99-9999)
            </label>
            <MaskedInput
                id="dateMask2"
                type="text"
                placeholder="__-__-____"
                className="form-input"
                mask={[/[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
            />
        </div>
        <div>
            <label htmlFor="dateMask3" className="text-white-dark">
                mask="'## December, ####'" (99 December, 9999)
            </label>
            <MaskedInput
                id="dateMask3"
                type="text"
                placeholder="__ December, ____"
                className="form-input"
                // mask={['99 December, 9999']}
                mask={[/[0-9]/, /[0-9]/, ' ', 'D', 'e', 'c', 'e', 'm', 'b', 'e', 'r', ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
            />
        </div>
    </fieldset>
</form>`})})]}),a("div",{className:"panel",children:[a("div",{className:"flex items-center justify-between mb-5",children:[e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"IP"}),e("button",{type:"button",className:"font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600",onClick:()=>l("code5"),children:a("span",{className:"flex items-center",children:[e(i,{className:"me-2"}),"Code"]})})]}),e("div",{className:"mb-5",children:e("form",{children:a("fieldset",{children:[e("label",{htmlFor:"ipMask",className:"text-white-dark",children:`mask="'###.###.###.###'" (192.198.1.1)`}),e(t,{id:"ipMask",type:"text",placeholder:"___.___.___.___",className:"form-input",mask:[/[0-9]/,/[0-9]/,/[0-9]/,".",/[0-9]/,/[0-9]/,/[0-9]/,".",/[0-9]/,/[0-9]/,/[0-9]/]})]})})}),s.includes("code5")&&e(r,{children:e("pre",{className:"language-typescript",children:`import MaskedInput from 'react-text-mask';

<form>
    <fieldset>
        <label htmlFor="ipMask" className="text-white-dark">
            mask="'###.###.###.###'" (192.198.1.1)
        </label>
        <MaskedInput
            id="ipMask"
            type="text"
            placeholder="___.___.___.___"
            className="form-input"
            mask={[/[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/]}
        />
    </fieldset>
</form>`})})]}),a("div",{className:"panel",children:[a("div",{className:"flex items-center justify-between mb-5",children:[e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Phone"}),e("button",{type:"button",className:"font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600",onClick:()=>l("code6"),children:a("span",{className:"flex items-center",children:[e(i,{className:"me-2"}),"Code"]})})]}),e("div",{className:"mb-5",children:e("form",{children:a("fieldset",{children:[e("label",{htmlFor:"phoneMask",className:"text-white-dark",children:`mask="'(###) ###-####'" ((999) 999-9999)`}),e(t,{id:"phoneMask",type:"text",placeholder:"(___) ___-____",className:"form-input",mask:["(",/[0-9]/,/[0-9]/,/[0-9]/,")"," ",/[0-9]/,/[0-9]/,/[0-9]/,"-",/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/]})]})})}),s.includes("code6")&&e(r,{children:e("pre",{className:"language-typescript",children:`import MaskedInput from 'react-text-mask';

<form>
    <fieldset>
        <label htmlFor="phoneMask" className="text-white-dark">
            mask="'(###) ###-####'" ((999) 999-9999)
        </label>
        <MaskedInput
            id="phoneMask"
            type="text"
            placeholder="(___) ___-____"
            className="form-input"
            mask={['(', /[0-9]/, /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
        />
    </fieldset>
</form>`})})]}),a("div",{className:"panel",children:[a("div",{className:"flex items-center justify-between mb-5",children:[e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Currency"}),e("button",{type:"button",className:"font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600",onClick:()=>l("code7"),children:a("span",{className:"flex items-center",children:[e(i,{className:"me-2"}),"Code"]})})]}),e("div",{className:"mb-5",children:e("form",{children:a("fieldset",{children:[e("label",{htmlFor:"currencyMask",className:"text-white-dark",children:"$999,9999,999.99"}),e(t,{id:"currencyMask",type:"text",placeholder:"$___,____,___.__",className:"form-input",mask:["$",/[0-9]/,/[0-9]/,/[0-9]/,",",/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,",",/[0-9]/,/[0-9]/,/[0-9]/,".",/[0-9]/,/[0-9]/]})]})})}),s.includes("code7")&&e(r,{children:e("pre",{className:"language-typescript",children:`import MaskedInput from 'react-text-mask';

<form>
    <fieldset>
        <label htmlFor="currencyMask" className="text-white-dark">
            $999,9999,999.99
        </label>
        <MaskedInput
            id="currencyMask"
            type="text"
            placeholder="$___,____,___.__"
            className="form-input"
            mask={['$', /[0-9]/, /[0-9]/, /[0-9]/, ',', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, ',', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/]}
        />
    </fieldset>
</form>`})})]})]})]})]})};export{M as default};
