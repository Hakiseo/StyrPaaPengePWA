import {customElement, property} from "lit/decorators.js";
import {html, LitElement, PropertyValues, TemplateResult} from "lit";

import {apiResponse} from "../sharedComponents/sharedInterfaces";
import {getWish, delete_Wish, confirm_Wish, update_Wish} from "../api/childApiRequests";
import {IWishlist} from "./childInterfaces";
import { router } from "../index";

@customElement("wish-detail-page")
export class WishDetailPage extends LitElement {
    @property({type: String}) errorMessage: string | null = "";
    @property() wishID: string = "";
    @property() wish!: IWishlist;
    @property() editMode: boolean = false;

    constructor() {
        super();
    }

    goBack(){
        router.navigate("/wishlist-overview")
    }

    render() : TemplateResult{
        if (!this.wish) return html `Loading ...`;
        return html`
            <h1>Ønskeliste: ${this.wish.saving_name}</h1>
            <img src="${this.wish.img}" alt="Wish Icon" width="200" height="200"><br><br>
            <button @click=${() => this.goBack()}>Tilbage</button><br>
            ${this.editMode ? this.renderEditForm() : this.renderInformation()}
            <button @click=${() => this.deleteWish()}>Delete Wish</button><br>
            <button @click=${() => this.confirmWish()}>Godkend</button><br>
        `;
    }

    renderInformation() {
        return html `
            <p> ${this.wish.saving_name} </p>
            <p> ${this.wish.content} </p>
            <p> ${this.wish.target_reward_balance} </p>
            <button @click=${() => this.editMode = true}> Redigér ønskeliste</button><br>
        `;
    }

    renderEditForm() {
        return html `
            <wish-form .detailForm="${true}"
                       .wishListName="${this.wish.saving_name}"
                       .wishListContent="${this.wish.content}"
                       .wishListTarget="${this.wish.target_reward_balance}"
                       @submit="${(e: CustomEvent) => {
                           this.updateWish(e);
                       }}"
            ></wish-form>
        `;
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

    renderError(){
        return html `
            <p> ${this.errorMessage} </p>
            <p> Please try again or please go back to main page </p>
        `;
    }

    updateWish(e : CustomEvent){
        console.log("Wishlist updated: ", e.detail)
        if (e.detail.wishListName && e.detail.wishListContent && e.detail.wishListTarget) {
            update_Wish(this.wish.id, e.detail.wishListName, e.detail.wishListContent, e.detail.wishListTarget).then((r : apiResponse) => {
                this.errorMessage = r.error
            })
            if(this.errorMessage){
                this.renderError()
            }else{
                this.editMode = false;
            }
        } else {
            window.alert("No fields may be left empty'!");
        }
    }

    deleteWish(){
        delete_Wish(this.wish.id).then((r : apiResponse) => {
            this.errorMessage = r.error
            // this.errorMessage = "r.error" //simulerer at der er en error besked
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            this.goBack()
        }
    }

    confirmWish(){
        confirm_Wish("1", this.wish.id).then((r : apiResponse) => {
            this.errorMessage = r.error
            // this.errorMessage = "r.error" //simulerer at der er en error besked
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            this.goBack()
        }
    }
}
