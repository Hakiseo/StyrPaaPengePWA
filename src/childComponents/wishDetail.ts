import {customElement, property} from "lit/decorators.js";
import {html, LitElement, PropertyValues, TemplateResult} from "lit";

import {apiResponse} from "../sharedComponents/sharedInterfaces";
import {getWish, delete_Wish} from "../api/childApiRequests";
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
        //TODO: DER SKAL LAVES EN FUNKTION HER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //Funktionen skal slette en ønskeliste!

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
        //TODO: DER SKAL LAVES EN FUNKTION HER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //Funktionen skal ændre værdien i databasen, så listen hentes til Forældrekontoen!
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
            <button @click=${this.goBack}>Tilbage</button><br>
            <h1>${this.wish.saving_name}: </h1>
            <img src="${this.wish.img}" alt="Wish Icon" width="200" height="200">
            <h4>ID:</h4>
            <p>${this.wish.id}</p>
            <h4>Creator ID:</h4>
            <p>${this.wish.creator_id}</p>
            <h4>Navn på liste:</h4>
            <p>${this.wish.saving_name}</p>
            <h4>Beskrivelse:</h4>
            <p>${this.wish.content}</p>
            <h4>Opsparing:</h4>
            <p>${this.wish.current_reward_balance}</p>
            <h4>Pris:</h4>
            <p>${this.wish.target_reward_balance}</p>
            <h4>Status:</h4>
            <p>${this.wish.current_status}</p>
            <button @click=${this.deleteWish}>Delete Wish</button><br>
            <button @click=${this.confirmWish()}>Godkend</button><br>
        `;
    }
}
