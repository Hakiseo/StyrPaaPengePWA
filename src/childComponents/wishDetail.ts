import {customElement, property} from "lit/decorators.js";
import {html, LitElement, PropertyValues} from "lit";
import {IWishlist} from "./childInterfaces";
import {getWish, deleteWish} from "../api/childApiRequests";
import { router } from "../index";

@customElement("wish-detail-page")
export class WishDetailPage extends LitElement {

    @property() wishID: string = "";
    @property({type: Object}) wish!: IWishlist;

    constructor() {
        super();
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        console.log("wishID: ", this.wishID)
        if (_changedProperties.has("wishID")) {
            getWish(this.wishID).then(r => this.wish = r);
            getWish(this.wishID).then(r => console.log(r));
        }
    }

    render(){
        if (!this.wish) return html `Loading ...`;
        return html`
            <div>
                ${this.renderWishInfo()}
            </div>
        `;
    }

    deleteWish(){
        deleteWish(this.wish.id)
        router.navigate("/wishlist-overview")
    }

    renderWishInfo(){
        /*
        return html`
            <button @click=${this.deleteWish}>Delete Wish</button><br>
            <h1>${this.wish.id}: </h1>
            <h1>${this.wish.name}: </h1>
            <h1>${this.wish.title}: </h1>
            <h1>${this.wish.color}: </h1>
        `;

         */
    }
}
