import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, TemplateResult} from "lit";
import {IWishlist} from "./childInterfaces";
import {getWishlist} from "../api/childApiRequests";
import {apiResponse} from "../sharedComponents/sharedInterfaces";

@customElement("wishlist-overview-page")
export class WishlistOverviewPage extends LitElement {

    //@property() wishlist: IWishlist[] = [];
    @property({type: Array}) wishlist!: IWishlist[];
    @property({type: String}) errorMassega: string = "";

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
            if(r.error !== null){
                this.wishlist = r.results
            }else{
                this.errorMassega = r.error
            }
        })

        //getWishlist().then(r => this.wishlist = r.result);
    }

    private renderWishes(){
        console.log(this.wishlist)
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

