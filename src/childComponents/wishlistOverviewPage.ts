import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, PropertyValues, TemplateResult} from "lit";
import {IWishlist} from "./childInterfaces";
import {getWishlist} from "../api/childApiRequests";
import {IApiResponse} from "../sharedComponents/sharedInterfaces";
import "../sharedComponents/wishElement"
import "../sharedComponents/buttonElement"
import "../sharedComponents/errorMessage"
import {router} from "../index";
import {getCurrentUserId} from "../api/apiUtils";

@customElement("wishlist-overview-page")
export class WishlistOverviewPage extends LitElement {

    @property() wishlist!: IWishlist[];
    @property({type: String}) errorMessage: string | null = "";

    connectedCallback() {
        super.connectedCallback();
        console.log("Returned to Overview-Page")
        console.log("Wishlist data" , this.wishlist)
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if(_changedProperties.has("wishlist")){
            console.log("Updated Wishlist" , this.wishlist)
            if(this.wishlist.length == 0){
                this.loadWishlist();
            }
        }
    }

    displayError(){
        window.alert(this.errorMessage)
    }

    loadWishlist(){
        getWishlist(getCurrentUserId()).then((r : IApiResponse) =>{
            if (r.results !== null) {
                console.log("Setting Wishlist")
                this.wishlist = r.results
            }
            if(r.error){
                this.errorMessage = "Error loading task data..."
                this.displayError()
            }
        })
    }

    protected render(): TemplateResult {
        if (!this.wishlist) return html `Loading ...`;
        return html `
            <div>
                ${this.renderWishes()}
            </div>
        `;
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
        if(!this.wishlist){
            console.log("Connected Callback")
            this.loadWishlist();
        }
    }

    goBack(){
        router.navigate("/child")
    }

    createWishList(){
        router.navigate("/wishlist-creating")
    }

    private renderWishes(){
        if (this.errorMessage) {


            //TODO RET DETTE TIL I DE ANDRE FILER:
            //<p> ${this.errorMessage} </p>
            //<p> Please try again or please go back to main page </p>
            //TODO DETTE SKAL ÆNDRES TIL AT BENYTTE VORES ERROR-ELEMENT
            //<error-message> ${this.errorMessage} Please try again or please go back to main page </error-message>


            return html `
                <error-message> ${this.errorMessage} Please try again or please go back to main page </error-message>
            `;
        }
        if(!this.wishlist){
            return html `
                <p> Error loading Wishlist...</p>
            `;
        }else{
            console.log("Render Wishlist")
            return html `
                <h1>Ønskelister:</h1>
                <button-element .action=${() => this.goBack()}>Tilbage</button-element><br>
                <button-element .action=${() => this.createWishList()}>Opret Ønskeliste</button-element><br>
                <section class="container">
                    ${this.wishlist.map(wish => {
                        return html `
                            <wish-element .wish=${wish} .parentView="${false}"></wish-element>
                        `
                    })}
                </section>
            `;
        }
    }
}
