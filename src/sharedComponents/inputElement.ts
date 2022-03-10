import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {InputType} from "./sharedInterfaces";

@customElement("input-element")
export class InputElement extends LitElement {
    @property() value: string = ""
    @property() label: string = ""

    @property() inputType: InputType = InputType.text;

    //TODO: style our input fields
    static get styles() {
        return css`
        
        `
    }

    protected render(): TemplateResult {
        return html `
            <label for="${this.label}"> ${this.label}: </label>
            <input type="${this.inputType}" value="${this.formatValue()}" id="${this.label}" name="${this.label}" @change="${(e: any) => this.emitChange(e)}">
        `;
    }

    formatValue() {
        if (this.inputType === InputType.number) {
            return parseInt(this.value)
        }
        return this.value
    }

    emitChange(e: any) {
        this.dispatchEvent(new CustomEvent("changeValue", {detail: e.target.value}))
    }
}