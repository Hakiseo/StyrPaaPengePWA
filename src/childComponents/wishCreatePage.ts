import {customElement, property} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";

import {apiResponse} from "../sharedComponents/sharedInterfaces";
import {create_Wishlist} from "../api/childApiRequests";
import { router } from "../index";
import "./wishForm";

@customElement("wish-create-page")
export class WishCreatePage extends LitElement {
    @property({type: String}) errorMessage: string | null = "";

    constructor() {
        super();
    }

    goBack(){
        router.navigate("/wishlist-overview")
    }

    render(): TemplateResult{
        return html`
            <h1>Opret Ønskeliste:</h1>
            <button @click=${() => this.goBack()}>Tilbage</button><br>
            <wish-form .createForm="${true}" @submit="${(e: CustomEvent) => {
                this.createWishList(e)
            }}"></wish-form>
        `;
    }

    /*
    deleteThisExampleFunctionWhenDone(e: CustomEvent) {
        console.log("New wishlist created: ", e.detail)
        if (e.detail.wishListName && e.detail.wishListContent && e.detail.wishListTarget) {
            this.goBack()
        } else {
            window.alert("No fields may be left empty'!");
        }
    }
    */

    createWishList(e: CustomEvent) {
        console.log("New wishlist created: ", e.detail)
        if (e.detail.wishListName && e.detail.wishListContent && e.detail.wishListTarget) {
            create_Wishlist(e.detail.wishListName, e.detail.wishListContent, e.detail.wishListTarget).then((r : apiResponse) => {
                this.errorMessage = r.error
            })
            if(this.errorMessage) {
                window.alert("Fejl... " + this.errorMessage)
            }else{
                window.alert("Oprettet Ønskeliste: " + name);
                this.goBack() //TODO: Er det det vi vil eller vil vi navigere til den specifikke nyoprettede ønskeliste?
                // this.resetWishCreation();
            }
        }else{
            window.alert("No fields may be left empty'!");
        }
    }
}
