import {html, LitElement, TemplateResult} from "lit";
import {property} from "lit/decorators.js";
import {customElement} from "lit/decorators.js";
import "../sharedComponents/inputElement";
import "../sharedComponents/buttonElement";
import {ButtonType, ICustomErrorHandling, InputType} from "../sharedComponents/sharedInterfaces";

@customElement("wish-form")
export class WishForm extends LitElement implements ICustomErrorHandling {
    @property({type: Boolean}) createForm: boolean = false;
    @property({type: Boolean}) detailForm: boolean = false;
    @property({type: String}) wishListName: string = "";
    @property({type: String}) wishListContent: string = "";
    @property({type: String}) wishListTarget: number = 100; //We can set the standard target to whatever we want

    @property() errorMessage: string = "";

    @property() wishListNameValid: boolean = true;
    @property() wishListContentValid: boolean = true;
    @property() wishListTargetValid: boolean = true;

    validated() {
        this.wishListNameValid = this.wishListName.length > 0
        this.wishListContentValid = this.wishListContent.length > 0
        this.wishListTargetValid = this.wishListTarget > 0
        if (!this.wishListTargetValid) {
            this.errorMessage = "Beløbet skal være større end 0!"
            return false;
        }
        if (!this.wishListNameValid || !this.wishListContentValid) {
            this.errorMessage = "All fields are required!"
            return false
        }
        return true;
    }

    protected render(): TemplateResult {
        return html`
            <div>
                <input-element .valid="${this.wishListNameValid}" label="Navn" .value="${this.wishListName}" @changeValue="${(e: CustomEvent) => this.wishListName = e.detail}"></input-element>
                <input-element .valid="${this.wishListContentValid}" label="Beskrivelse" .value="${this.wishListContent}" @changeValue="${(e: CustomEvent) => this.wishListContent = e.detail}"></input-element>
                <input-element .valid="${this.wishListTargetValid}" .inputType="${InputType.number}" label="Beløb" .value="${this.wishListTarget}" @changeValue="${(e: CustomEvent) => this.wishListTarget = e.detail}"></input-element>
                ${this.renderSubmitButton()}
            </div>
        `;
    }

    submitForm() {
        if(this.validated()){
            this.dispatchEvent(
                new CustomEvent("submit", {
                    detail: {
                        wishListName: this.wishListName,
                        wishListContent: this.wishListContent,
                        wishListTarget: this.wishListTarget
                    }
                })
            )
        }else{
            window.alert(this.errorMessage)
            this.errorMessage = "";
        }
    }

    //kunne være skrevet inline i render funktionen men adskiller det for at gøre det mere læsbart.
    //Hvis vi ville beholde knappen i renderfunktionen så kan vi i knap-teksten sige ${this.createForm ? "Opret" : "Gem Ændringer"}
    renderSubmitButton() {
        if (this.createForm) {
            return html `
            <button-element .buttonType="${ButtonType.confirm}" .action="${() => this.submitForm()}"> Opret </button-element>
        `}
        if(this.detailForm){
            return html `
            <button-element .buttonType="${ButtonType.confirm}" .action="${() => this.submitForm()}"> Gem Ændringer </button-element>
        `}
        return html `
            <button-element .buttonType="${ButtonType.confirm}" .action="${() => this.submitForm()}"> Redigere </button-element>
        `
    }
}
