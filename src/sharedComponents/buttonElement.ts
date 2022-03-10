import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";

@customElement("button-element")
export class ButtonElement extends LitElement {
    @property() action: () => void = () => {};

    //TODO: style our buttons
    static get styles() {
        return css`
        
        `
    }

    render(): TemplateResult {
        return html`
            <button type="button" @click="${() => this.action()}"> <slot></slot> </button>
        `;
    }
}