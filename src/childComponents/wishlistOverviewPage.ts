import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, TemplateResult} from "lit";
import {IWishlist} from "./childInterfaces";
import {getWishlist} from "../api/childApiRequests";
import {ApiResponse} from "../sharedComponents/sharedInterfaces";
import "../sharedComponents/wishElement"
import {router} from "../index";

@customElement("wishlist-overview-page")
export class WishlistOverviewPage extends LitElement {

    @property() wishlist!: IWishlist[];
    @property({type: String}) errorMessage: string | null = "";

    protected render(): TemplateResult {
        if (!this.wishlist) return html `Loading ...`;
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
        getWishlist().then((r : ApiResponse) =>{
            //TODO: TOMY make this correctly
            if (r.results !== null) {
                this.wishlist = r.results
            }
            this.errorMessage = r.error
            // this.errorMessage = "r.error" //simulerer at der er en error besked
        })
    }

    goBack(){
        router.navigate("/child")
    }

    createWishList(){
        router.navigate("/wishlist-creating")
    }

    private renderWishes(){
        if (this.errorMessage) {
            return html `
                <p> ${this.errorMessage} </p>
                <p> Please try again or please go back to main page </p>
            `;
        }
        if(this.wishlist){
            return html `
                <h1>Ønskelister:</h1>
                <button @click=${() => this.goBack()}>Tilbage</button><br>
                <button @click=${() => this.createWishList()}>Opret Ønskeliste</button><br>

                <section class="container">
                    ${this.wishlist.map(wish => {
                        console.log(wish)
                        return html `
                    <wish-element .wish=${wish}></wish-element>
                `
                    })}
                </section>
            `;
        }else{
            return html `
                <p> Error loading Wishlist...</p>
            `;
        }
    }
}

