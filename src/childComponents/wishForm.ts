import {html, LitElement, TemplateResult} from "lit";
import {property} from "lit/decorators.js";
import {customElement} from "lit/decorators.js";

@customElement("wish-form")
export class WishForm extends LitElement {
    @property({type: Boolean}) createForm: boolean = false;
    @property({type: String}) wishListName: string = "";
    @property({type: String}) wishListContent: string = "";
    @property({type: String}) wishListTarget: number = 100; //We can set the standard target to whatever we want

    protected render(): TemplateResult {
        return html`
            <div> 
                <label> Name: </label>
                <br>
                <input class="w3-input w3-border w3-light-grey" style="max-width: 140px" 
                type="text" @change=${(e:any) => this.wishListName = e.target.value}>
                <br>
                <label> Content: </label>
                <br>
                <input class="w3-input w3-border w3-light-grey" style="max-width: 140px" 
                type="text" @change=${(e:any) => this.wishListContent = e.target.value}>
                <br>
                <label> Target: </label>
                <br>
                <input class="w3-input w3-border w3-light-grey" style="max-width: 140px"
                type="number" value="${this.wishListTarget}" @change=${(e:any) => this.wishListTarget = e.target.value}>
                <br>
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
    // Hvis vi ville beholde knappen i renderfunktionen så kan vi i knap-teksten sige ${this.createForm ? "Opret" : "Gem Ændringer"}
    renderSubmitButton() {
        if (this.createForm) {
            return html `
            <button class="w3-btn w3-margin-left w3-margin-right w3-blue w3-border w3-border-blue w3-round w3-right"
                    @click="${() => this.submitForm()}"> Opret </button>
        `
        }

        return html `
            <button class="w3-btn w3-margin-left w3-margin-right w3-blue w3-border w3-border-blue w3-round w3-right"
                    @click="${() => this.submitForm()}"> Gem ændringer </button>
        `
    }
}