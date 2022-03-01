import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, TemplateResult} from "lit";
import {IWishlist} from "./childInterfaces";
import {getWishlist} from "../api/childApiRequests";
import {apiResponse} from "../sharedComponents/sharedInterfaces";

@customElement("wishlist-overview-page")
export class WishlistOverviewPage extends LitElement {

    @property() wishlist!: IWishlist[];
    @property({type: String}) errorMessage: string | null = "";

    protected render(): TemplateResult {
        if(!this.wishlist){
            return html `
                <p>Loading....</p>
            `;
        }
        return html `
            <div>
                ${this.renderWishes()}
            </div>
        `
    }

    static styles = [css`
        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
        }
    `];

    constructor() {
        super();
        getWishlist().then((r : apiResponse) =>{
            this.wishlist = r.results
            this.errorMessage = "r.error"
            // this.errorMessage = "r.error" //simulerer at der er en error besked
        })
    }

    private renderWishes(){
        if (this.errorMessage) {
            return html `
                <p> ${this.errorMessage} </p>
                <p> Please try again or please go back to main page </p>
            `
        }
        return html `
            <h1>Wish Overview:</h1>
            <section class="container">
                ${this.wishlist.map(wish => html `
                    <wish-element .wish=${wish}></wish-element>
                `)}
            </section>
        `;
    }
}

