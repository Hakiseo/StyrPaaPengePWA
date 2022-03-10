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

    //TODO: style our input fields
    static get styles() {
        return css`
            .invalidInput {
                border: 3px solid red;
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
            <label for="${this.inputId}"> ${this.label}: </label>
            <input class="${classMap({invalidInput: !this.valid})}" type="${this.inputType}" value="${this.formatValue()}" id="${this.inputId}" name="${this.inputId}" @change="${(e: any) => this.emitChange(e)}">
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