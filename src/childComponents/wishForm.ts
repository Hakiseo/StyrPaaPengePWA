import {css, html, LitElement, TemplateResult} from "lit";
import {property} from "lit/decorators.js";
import {customElement} from "lit/decorators.js";
import "../sharedComponents/inputElement";
import "../sharedComponents/buttonElement";
import {ICustomErrorHandling, InputType} from "../sharedComponents/sharedInterfaces";

@customElement("wish-form")
export class WishForm extends LitElement implements ICustomErrorHandling {
    @property() errorMessage: string | undefined;
    @property({type: Boolean}) createForm: boolean = false;
    @property({type: Boolean}) detailForm: boolean = false;
    @property({type: String}) wishListName: string = "";
    @property({type: String}) wishListContent: string = "";
    @property({type: String}) wishListTarget: number = 100; //We can set the standard target to whatever we want

    static styles = [css`
        input:invalid {
            border: 3px solid red;
        }
    `];

    validated() {
        //Insert logic and return the corresponding boolean value
        return true
    }

    protected render(): TemplateResult {
        return html`
            <div>
                <input-element label="Navn" .value="${this.wishListName}" @changeValue="${(e: CustomEvent) => this.wishListName = e.detail}"></input-element>
                <input-element label="Beskrivelse" .value="${this.wishListContent}" @changeValue="${(e: CustomEvent) => this.wishListContent = e.detail}"></input-element>
                <input-element .inputType="${InputType.number}" label="Beløb" .value="${this.wishListTarget}" @changeValue="${(e: CustomEvent) => this.wishListTarget = e.detail}"></input-element>
                ${this.renderSubmitButton()}
            </div>
        `;
    }

    submitForm() {
        this.dispatchEvent(
            new CustomEvent("submit", {
                detail: {
                    wishListName: this.wishListName,
                    wishListContent: this.wishListContent,
                    wishListTarget: this.wishListTarget
                }
            }))
    }

    //kunne være skrevet inline i render funktionen men adskiller det for at gøre det mere læsbart.
    //Hvis vi ville beholde knappen i renderfunktionen så kan vi i knap-teksten sige ${this.createForm ? "Opret" : "Gem Ændringer"}
    renderSubmitButton() {
        if (this.createForm) {
            return html `
            <button-element .action="${() => this.submitForm()}"> Opret </button-element>
        `}
        if(this.detailForm){
            return html `
            <button-element .action="${() => this.submitForm()}"> Gem Ændringer </button-element>
        `}
        return html `
            <button-element .action="${() => this.submitForm()}"> Redigere </button-element>
        `
    }
}
