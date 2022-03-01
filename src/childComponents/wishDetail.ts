import {customElement, property} from "lit/decorators.js";
import {html, LitElement, PropertyValues, TemplateResult} from "lit";

import {apiResponse} from "../sharedComponents/sharedInterfaces";
import {getWish, deleteWish} from "../api/childApiRequests";
import {IWishlist} from "./childInterfaces";
import { router } from "../index";

@customElement("wish-detail-page")
export class WishDetailPage extends LitElement {

    @property() wishID: string = "";
    @property() wish!: IWishlist;

    @property({type: String}) errorMessage: string | null = "";

    constructor() {
        super();
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        console.log("wishID: ", this.wishID)
        if (_changedProperties.has("wishID")) {
            getWish(this.wishID).then((r : apiResponse) => {
                if(r.results !== null){
                    let tempWishList:IWishlist[] = r.results;
                    this.wish = tempWishList[0]
                }else{
                    this.errorMessage = r.error;
                }
            });
        }
    }

    render() : TemplateResult{
        if (!this.wish) return html `Loading ...`;
        return html`
            <div>
                ${this.renderWishInfo()}
            </div>
        `;
    }

    deleteWish(){
        deleteWish(this.wish.id).then((r : apiResponse) => {
            this.errorMessage = r.error
            // this.errorMessage = "r.error" //simulerer at der er en error besked
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            router.navigate("/wishlist-overview")
        }
    }

    renderError(){
        return html `
            <p> ${this.errorMessage} </p>
            <p> Please try again or please go back to main page </p>
        `;
    }

    renderWishInfo(){
        return html`
            <button @click=${this.deleteWish}>Delete Wish</button><br>
            <h1>${this.wish.saving_name}: </h1>
            <p>${this.wish.content}: </p>
            <h1>${this.wish.current_status}: </h1>
        `;
    }
}
