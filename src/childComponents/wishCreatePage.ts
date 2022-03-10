import {customElement, property} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";

import {IApiResponse, ICustomErrorHandling} from "../sharedComponents/sharedInterfaces";
import {create_Wishlist} from "../api/childApiRequests";
import { router } from "../index";
import "./wishForm";
import {getCurrentUserId} from "../api/apiUtils";
import "../sharedComponents/buttonElement";

@customElement("wish-create-page")
export class WishCreatePage extends LitElement implements ICustomErrorHandling {
    @property({type: String}) errorMessage: string | undefined = "";

    constructor(){
        super();
    }

    validated() {
        //Insert logic and return the corresponding boolean value
        return true;
    }

    goBack(){
        router.navigate("/wishlist-overview")
    }

    render(): TemplateResult{
        return html`
            <h1>Opret Ønskeliste:</h1>
            <button-element .action=${() => this.goBack()}>Tilbage</button-element>
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
                .then((r : IApiResponse) => {
                    if (r.error) this.errorMessage = r.error
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
