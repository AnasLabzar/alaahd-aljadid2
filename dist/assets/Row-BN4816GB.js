import{r as d,j as x,c as m,u as B,a1 as h,a2 as N}from"./index-D69f5Fi2.js";function j({as:p,bsPrefix:e,className:u,...o}){e=B(e,"col");const i=h(),c=N(),n=[],$=[];return i.forEach(r=>{const l=o[r];delete o[r];let s,a,t;typeof l=="object"&&l!=null?{span:s,offset:a,order:t}=l:s=l;const f=r!==c?`-${r}`:"";s&&n.push(s===!0?`${e}${f}`:`${e}${f}-${s}`),t!=null&&$.push(`order${f}-${t}`),a!=null&&$.push(`offset${f}-${a}`)}),[{...o,className:m(u,...n,...$)},{as:p,bsPrefix:e,spans:n}]}const R=d.forwardRef((p,e)=>{const[{className:u,...o},{as:i="div",bsPrefix:c,spans:n}]=j(p);return x.jsx(i,{...o,ref:e,className:m(u,!n.length&&c)})});R.displayName="Col";const w=d.forwardRef(({bsPrefix:p,className:e,as:u="div",...o},i)=>{const c=B(p,"row"),n=h(),$=N(),r=`${c}-cols`,l=[];return n.forEach(s=>{const a=o[s];delete o[s];let t;a!=null&&typeof a=="object"?{cols:t}=a:t=a;const f=s!==$?`-${s}`:"";t!=null&&l.push(`${r}${f}-${t}`)}),x.jsx(u,{ref:i,...o,className:m(e,c,...l)})});w.displayName="Row";export{R as C,w as R};
