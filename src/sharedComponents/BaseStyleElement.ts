import {CSSResultGroup, LitElement, unsafeCSS} from "lit";

export class BaseStyleElement extends LitElement {
    static get styles(): CSSResultGroup {
        // console.log(Object.values(document.styleSheets).map(r => r.href))
        let globalStyle = Object.values(document.styleSheets[0].cssRules).map(s => s.cssText).join('\n')
        let baseStyles = unsafeCSS(globalStyle) //https://lit.dev/docs/components/styles/#expressions
        return baseStyles;
    }
}