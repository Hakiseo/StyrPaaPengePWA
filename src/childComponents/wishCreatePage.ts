import {customElement, property} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";

import {ButtonType, IApiResponse, ICustomErrorHandling} from "../sharedComponents/sharedInterfaces";
import {create_Wishlist} from "../api/childApiRequests";
import { router } from "../index";
import "./wishForm";
import {getCurrentUserId} from "../api/apiUtils";
import "../sharedComponents/buttonElement";

@customElement("wish-create-page")
export class WishCreatePage extends LitElement implements ICustomErrorHandling {
    @property({type: String}) errorMessage: string | undefined = "";

    validated() {
        return true;
    }

    constructor(){
        super();
    }

    goBack(){
        router.navigate("/wishlist-overview")
    }

    displayError(){
        window.alert(this.errorMessage)
        this.errorMessage = "";
    }

    render(): TemplateResult{
        return html`
            <h1>Opret ├śnskeliste:</h1>
            <button-element .buttonType="${ButtonType.navigate}" .action=${() => this.goBack()}>Tilbage</button-element>
            <wish-form .createForm="${true}" @submit="${(e: CustomEvent) => {
                this.createWishList(e)
            }}"></wish-form>
        `;
    }

    createWishList(e: CustomEvent){
        if (e.detail.wishListName && e.detail.wishListContent && e.detail.wishListTarget) {
            create_Wishlist({
                creator_id: getCurrentUserId(),
                saving_name: e.detail.wishListName,
                content: e.detail.wishListContent,
                target_reward_balance: e.detail.wishListTarget
            }).then((r : IApiResponse) => {
                    if(r.error){
                        this.errorMessage = "Error creating wish..."
                        this.displayError()
                    }else{
                        this.goBack()
                    }
                }
            )
        }else{
            this.errorMessage = "No fields may be left empty!"
            this.displayError()
        }
    }
}
