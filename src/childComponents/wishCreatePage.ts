import {customElement, property} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";

import {ApiResponse} from "../sharedComponents/sharedInterfaces";
import {create_Wishlist} from "../api/childApiRequests";
import { router } from "../index";
import "./wishForm";
import {getCurrentUserId} from "../api/apiUtils";

@customElement("wish-create-page")
export class WishCreatePage extends LitElement {
    @property({type: String}) errorMessage: string | null = "";

    constructor(){
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

    createWishList(e: CustomEvent){
        console.log("New wishlist created: ", e.detail)
        if (e.detail.wishListName && e.detail.wishListContent && e.detail.wishListTarget) {
            create_Wishlist(
                getCurrentUserId(),
                e.detail.wishListName,
                e.detail.wishListContent,
                e.detail.wishListTarget)
                .then((r : ApiResponse) => {
                    this.errorMessage = r.error
            })
            if(this.errorMessage) {
                window.alert("Fejl... " + this.errorMessage)
            }else{
                window.alert("Oprettet Ønskeliste: " + e.detail.wishListName);
                this.goBack()
                // this.resetWishCreation();
            }
        }else{
            window.alert("No fields may be left empty'!");
        }
    }
}
