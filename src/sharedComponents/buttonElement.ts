import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";

@customElement("button-element")
export class ButtonElement extends LitElement {
    @property() action: () => void = () => {};

    static get styles() {
        //https://www.w3schools.com/css/css3_buttons.asp
        return css`
            button {
                background-color: #4CAF50; /* Green */
                border-radius: 5px;
                padding: 6px 18px;
                border: none;
                color: white;
                text-align: center;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
            }
        `
    }

    render(): TemplateResult {
        return html`
            <button type="button" @click="${() => this.action()}"> <slot></slot> </button>
        `;
    }
}