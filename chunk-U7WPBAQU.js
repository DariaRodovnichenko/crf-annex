import{b as a}from"./chunk-TW2DRI74.js";import{d as n}from"./chunk-62FRKGEW.js";import{c}from"./chunk-WMIBQZS3.js";import{b as r,f as i,g as l,j as s}from"./chunk-57VAAUCC.js";import"./chunk-D7YYRZS5.js";var h="button{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;width:100%;height:34px;border:0px;outline:none;background:transparent;color:inherit;font-family:var(--ion-font-family, inherit);font-size:inherit;line-height:34px;text-align:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;overflow:hidden}:host(.option-disabled){opacity:0.4}:host(.option-disabled) button{cursor:default}",u=h,b="button{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;width:100%;height:34px;border:0px;outline:none;background:transparent;color:inherit;font-family:var(--ion-font-family, inherit);font-size:inherit;line-height:34px;text-align:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;overflow:hidden}:host(.option-disabled){opacity:0.4}:host(.option-disabled) button{cursor:default}:host(.option-active){color:var(--ion-color-base)}",m=b,y=(()=>{let o=class{constructor(t){r(this,t),this.pickerColumn=null,this.ariaLabel=null,this.disabled=!1,this.value=void 0,this.color="primary"}onAriaLabelChange(t){this.ariaLabel=t}componentWillLoad(){let t=n(this.el,["aria-label"]);this.ariaLabel=t["aria-label"]||null}connectedCallback(){this.pickerColumn=this.el.closest("ion-picker-column")}disconnectedCallback(){this.pickerColumn=null}componentDidLoad(){let{pickerColumn:t}=this;t!==null&&t.scrollActiveItemIntoView()}onClick(){let{pickerColumn:t}=this;t!==null&&t.setValue(this.value)}render(){let{color:t,disabled:e,ariaLabel:d}=this,p=c(this);return i(l,{key:"c1353e99c2aa19c0e3ddbe433557ed18e72e1c66",class:a(t,{[p]:!0,"option-disabled":e})},i("button",{key:"b4ee62ecf7458a07a56e8aa494485766a87a3fcb",tabindex:"-1","aria-label":d,disabled:e,onClick:()=>this.onClick()},i("slot",{key:"9ab1e4700c27103b676670a4b3521c183c6ab83d"})))}get el(){return s(this)}static get watchers(){return{"aria-label":["onAriaLabelChange"]}}};return o.style={ios:u,md:m},o})();export{y as ion_picker_column_option};
