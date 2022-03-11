import {css, html, LitElement, TemplateResult} from "lit";
import {customElement} from "lit/decorators.js";

@customElement("error-message")
export class ButtonElement extends LitElement {
    //TODO: style our error messages
    static get styles() {
        return css`
            slot {
                color: red
            }
        `
    }

    render(): TemplateResult {
        return html`
            <p> <slot></slot> </p>
        `;
    }
}