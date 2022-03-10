import {css, html, LitElement, TemplateResult} from "lit";
import {customElement} from "lit/decorators.js";

@customElement("p-element")
export class TextDisplayElement extends LitElement {

    //TODO: style our display fields
    static get styles() {
        return css`
            
        `
    }

    protected render(): TemplateResult {
        return html `
            <p> <slot></slot> </p>
        `;
    }
}