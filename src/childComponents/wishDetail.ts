import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, PropertyValues, TemplateResult} from "lit";

import {apiResponse} from "../sharedComponents/sharedInterfaces";
import {getWish, delete_Wish, confirm_Wish} from "../api/childApiRequests";
import {IWishlist} from "./childInterfaces";
import { router } from "../index";

@customElement("wish-detail-page")
export class WishDetailPage extends LitElement {

    static styles = [css`
        #contentBox{
            height:200px;
            max-width: 200px;
            min-width: 200px;
            max-height:200px;
            min-height:200px;
        }
    `];

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
        delete_Wish(this.wish.id).then((r : apiResponse) => {
            this.errorMessage = r.error
            // this.errorMessage = "r.error" //simulerer at der er en error besked
        })
        if(this.errorMessage){
            this.renderError()
        }else{
            router.navigate("/wishlist-overview")
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
            router.navigate("/wishlist-overview")
        }
    }

    goBack(){
        router.navigate("/wishlist-overview")
    }

    renderError(){
        return html `
            <p> ${this.errorMessage} </p>
            <p> Please try again or please go back to main page </p>
        `;
    }

    renderWishInfo(){
        return html`
            <button @click=${() => this.goBack()}>Tilbage</button><br>
            <img src="${this.wish.img}" alt="Wish Icon" width="200" height="200">
            <br>
            <br>
            <form>
                <h2>${this.wish.saving_name}</h2><br>
                <label>ID:</label><br>
                <input type="text" name="ID" value="${this.wish.id}"></input><br>
                <label>Creator ID:</label><br>
                <input type="text" name="Creator ID" value="${this.wish.creator_id}"></input><br>
                <label>Navn på liste:</label><br>
                <input type="text" name="Navn" value="${this.wish.saving_name}"></input><br>
                <label>Beskrivelse:</label><br>
                <textarea id="contentBox" rows="2" cols="25">${this.wish.content}}</textarea><br>
                <label>Pris:</label><br>
                <input type="text" name="Pris" value="${this.wish.target_reward_balance}"></input><br>
                <label>Status:</label><br>
                <input type="text" name="Status" value="${this.wish.current_status}"></input><br>
                
                <input type="submit" value="Edit">
                
            </form>
            <br>
            <br>
            <button @click=${() => this.deleteWish()}>Delete Wish</button><br>
            <button @click=${() => this.confirmWish()}>Godkend</button><br>
        `;
    }
}
