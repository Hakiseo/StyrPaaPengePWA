import {customElement, property} from "lit/decorators.js";
import {html, LitElement, PropertyValues, TemplateResult} from "lit";

import {ApiResponse} from "./sharedInterfaces";
import {IWishlist} from "../childComponents/childInterfaces";
import {getWish, delete_Wish, confirm_Wish, update_Wish} from "../api/childApiRequests";
import {reject_WishParent, getWishParent} from "../api/parentApiRequests";
import { router } from "../index";
import "../childComponents/wishForm";

@customElement("wish-detail-page")
export class WishDetailPage extends LitElement {
    @property({type: Boolean}) parentView: boolean = false;
    @property({type: String}) errorMessage: string | null = "";

    @property() wishID: string = "";
    @property() wish!: IWishlist;
    @property() editMode: boolean = false;

    constructor() {
        super();
    }

    render() : TemplateResult{
        if (!this.wish) return html `Loading ...`;
        return html`
            <h1>Ønskeliste:${this.wish.saving_name}</h1>
            <img src="${this.wish.img}" alt="Wish Icon" width="200" height="200"><br><br>
            ${this.parentView ? this.renderParentInfoForm() : this.editMode ? this.renderChildEditForm() : this.renderChildInfoForm()}
        `;
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        console.log("wishID: ", this.wishID)
        if (_changedProperties.has("wishID")) {
            this.loadWish();
        }
    }

    renderError(){
        return html `
            <p> ${this.errorMessage} </p>
            <p> Please try again or please go back to main page </p>
        `;
    }

    loadWish(){
        this.getHandler().then((r : ApiResponse) => {
            if(r.results !== null){
                let tempWishList:IWishlist[] = r.results;
                this.wish = tempWishList[0]
            }else{
                this.errorMessage = r.error;
            }
        });
    }

    getHandler(){
        if(this.parentView) {
            return getWishParent(this.wishID)
        }else{
            return getWish(this.wishID)
        }
    }

    //TODO Parent:
    renderParentInfoForm(){
        return html `
            <button @click=${() => this.goBackParent()}>Tilbage</button><br>
            <h3>${this.wish.saving_name}</h3><br>
            <h3>${this.wish.target_reward_balance}</h3><br>
            <h3>Assigned Junior-konto here: </h3><br>
            <h3>${this.wish.creator_id}</h3><br>
            <button @click=${() => this.rejectWishParent()}>Afvis</button><br>
            <button @click=${() => this.confirmWishParent()}>Godkend</button><br>
        `;
    }

    goBackParent(){
        router.navigate("/parent")
    }

    rejectWishParent(){
        reject_WishParent("0", this.wish.id).then((r : ApiResponse) => {
            this.errorMessage = r.error
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            router.navigate("/parent");
        }
    }

    confirmWishParent(){
        console.log("BØR VI BARE SLETTE DEN HER, ELLER SKAL VI LAVE EN NY BOOL VÆRDI I DATABASEN?");
        //TODO, BØR VI BARE SLETTE DEN HER, ELLER SKAL VI LAVE EN NY BOOL VÆRDI I DATABASEN?
    }

    //TODO Child:
    renderChildInfoForm() {
        return html `
            <button @click=${() => this.goBackChild()}>Tilbage</button><br>
            <p> ${this.wish.saving_name} </p>
            <p> ${this.wish.content} </p>
            <p> ${this.wish.target_reward_balance} </p>
            <button @click=${() => this.editMode = true}>Redigér Ønskeliste</button><br>
            <button @click=${() => this.deleteWishChild()}>Slet Ønskeliste</button><br>
            <button @click=${() => this.confirmWishChild()}>Indløs</button><br>
        `;
    }

    renderChildEditForm() {
        return html `
            <button @click=${() => this.goBackChild()}>Tilbage</button><br>
            <wish-form .detailForm="${true}"
                       .wishListName="${this.wish.saving_name}"
                       .wishListContent="${this.wish.content}"
                       .wishListTarget="${this.wish.target_reward_balance}"
                       @submit="${(e: CustomEvent) => {this.updateWishChild(e);}}"
            ></wish-form>
            <button @click=${this.editMode = false, () => this.loadWish()}>Annullere</button><br>
        `;
    }

    goBackChild(){
        router.navigate("/wishlist-overview")
    }

    updateWishChild(e : CustomEvent){
        console.log("Wishlist updated: ", e.detail)
        if (e.detail.wishListName && e.detail.wishListContent && e.detail.wishListTarget) {
            update_Wish(this.wish.id, e.detail.wishListName, e.detail.wishListContent, e.detail.wishListTarget).then((r : ApiResponse) => {
                this.errorMessage = r.error
                this.loadWish();
            })
            if(this.errorMessage || this.errorMessage == ""){
                this.renderError()
            }else{
                this.editMode = false;
            }
        } else {
            window.alert("No fields may be left empty'!");
        }
    }

    confirmWishChild(){
        confirm_Wish("1", this.wish.id).then((r : ApiResponse) => {
            this.errorMessage = r.error
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            this.goBackChild()
        }
    }

    deleteWishChild(){
        delete_Wish(this.wish.id).then((r : ApiResponse) => {
            this.errorMessage = r.error
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            this.goBackChild()
        }
    }
}