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

    render(): TemplateResult{
        return html`
            <h1>Opret Ønskeliste:</h1>
            <button @click=${() => this.goBack()}>Tilbage</button><br>
            <wish-form .createForm="${true}" @submit="${(e: CustomEvent) => {
                this.deleteThisExampleFunctionWhenDone(e)
                // this.createWishList(e.detail.wishListName, e.detail.wishListContent, e.detail.wishListTarget)
            }}"></wish-form>
        `;
    }

    deleteThisExampleFunctionWhenDone(e: CustomEvent) {
        console.log("New wishlist created: ", e.detail)
        if (e.detail.wishListName && e.detail.wishListContent && e.detail.wishListTarget) {
            this.goBack()
        } else {
            window.alert("No fields may be left empty'!");
        }
    }

    createWishList(name: string, content: string, target: number) {
        if (name && content && target) {
            create_Wishlist(name, content, target).then((r : apiResponse) => {
                this.errorMessage = r.error
                // this.errorMessage = "r.error" //simulerer at der er en error besked
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

/*    resetWishCreation() {
        this.name = "";
        this.content = "";
        this.target = "";
    }*/

    goBack(){
        router.navigate("/wishlist-overview")
    }
}
