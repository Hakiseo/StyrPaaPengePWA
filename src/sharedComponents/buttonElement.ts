import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {ButtonType} from "./sharedInterfaces";
import {classMap} from "lit/directives/class-map.js";

@customElement("button-element")
export class ButtonElement extends LitElement {
    @property() action: () => void = () => {};
    @property() buttonType: ButtonType = ButtonType.navigate;
    @property() deleteMessage: string = "";

    static get styles() {
        //https://www.w3schools.com/css/css3_buttons.asp
        return css`
            button {
                border-radius: 5px;
                padding: 6px 18px;
                border: none;
                text-align: center;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
            }
            
            .confirm {
                background-color: #258128; /* Green */
                color: white;
            }
            
            .deny {
                background-color: #ba181b; /* Red */
                color: white;
            }
            
            .navigate {
                background-color: #14213d; /* Dark blue */
                color: white;
            }
        `
    }

    render(): TemplateResult {
        const buttonStyle = {
            confirm: this.buttonType === ButtonType.confirm,
            deny: this.buttonType === ButtonType.delete || this.buttonType === ButtonType.deny,
            navigate: this.buttonType === ButtonType.navigate || this.buttonType === ButtonType.cancel
        }
        return html`
            <button type="button" class="${classMap(buttonStyle)}" @click="${() => this.buttonAction()}"> <slot></slot> </button>
        `;
    }

    buttonAction() {
        if (this.buttonType === ButtonType.delete) {
            confirm(this.deleteMessage) ? this.action() : "";
            return;
        }
        this.action()
    }
}