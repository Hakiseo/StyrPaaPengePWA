import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, TemplateResult} from "lit";
import {IWishlist} from "./childInterfaces";
import {getWishlist} from "../api/childApiRequests";

@customElement("wish-overview-page")
export class WishOverviewPage extends LitElement {

    @property({type: Array}) wishlist: IWishlist[] = [];

    protected render(): TemplateResult {
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
        getWishlist().then(r => this.wishlist = r);
    }

    private renderWishes(){
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