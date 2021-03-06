import {css, html, LitElement, PropertyValues, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import {InputType} from "./sharedInterfaces";

@customElement("input-element")
export class InputElement extends LitElement {
    @property() value: string = ""
    @property() label: string = ""
    @property() inputId: string = ""
    @property() valid: boolean = true

    @property() inputType: InputType = InputType.text;

    static get styles() {
        //https://www.w3schools.com/css/css_form.asp
        return css`
            .invalidInput {
                border: 2px solid red;
            }
            
            input {
              width: 100%;
              padding: 12px 20px;
              margin: 8px 0;
              display: inline-block;
              border: 1px solid #ccc;
              border-radius: 10px;
              box-sizing: border-box;
            }
        `
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (_changedProperties.has("label")) {
            if (this.label.includes("/")) {
                this.inputId = this.label.split("/").join()
            } else {
                this.inputId = this.label.split(" ").join()
            }
        }
    }

    protected render(): TemplateResult {
        return html `
            <label for="${this.inputId}"> <b> ${this.label}: </b> </label>
            <input class="${classMap({invalidInput: !this.valid})}" 
                   type="${this.inputType}" 
                   value="${this.formatValue()}" 
                   id="${this.inputId}" 
                   name="${this.inputId}" 
                   placeholder="${this.label}"
                   @change="${(e: any) => this.emitChange(e)}">
        `;
    }

    formatValue(value = this.value) {
        if (this.inputType === InputType.number) {
            return parseInt(value)
        }
        return value
    }

    emitChange(e: any) {
        this.dispatchEvent(new CustomEvent("changeValue", {detail: this.formatValue(e.target.value)}))
    }
}