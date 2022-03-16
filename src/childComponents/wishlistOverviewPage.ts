import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, PropertyValues, TemplateResult} from "lit";
import {getChildInfo, getWishlist} from "../api/childApiRequests";
import {ButtonType, IApiResponse, IWishlist} from "../sharedComponents/sharedInterfaces";
import "../sharedComponents/wishElement"
import "../sharedComponents/buttonElement"
import "../sharedComponents/errorMessage"
import {router} from "../index";
import {getCurrentUserId} from "../api/apiUtils";
import {IAccountInfo} from "./childInterfaces";

@customElement("wishlist-overview-page")
export class WishlistOverviewPage extends LitElement {

    @property() wishlist!: IWishlist[];
    @property({type: String}) errorMessage: string | null = "";
    @property() currentBalance!: number;

    connectedCallback() {
        super.connectedCallback();
        console.log("wish overview")
        console.log(this.currentBalance)
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        if (!this.currentBalance) {
            console.log("Firstupdated get balance")
            this.getBalance()
        }
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if(_changedProperties.has("wishlist")){
            if(!this.wishlist){
                this.loadWishlist();
            }
        }
    }

    displayError(){
        window.alert(this.errorMessage)
        this.errorMessage = "";
    }

    loadWishlist(){
        getWishlist(getCurrentUserId()).then((r : IApiResponse) =>{
            if (r.results !== null) {
                this.wishlist = r.results
            }
            if(r.error){
                this.errorMessage = "Error loading task data..."
                this.displayError()
            }
        })
    }

    protected render(): TemplateResult {
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
        if(!this.wishlist){
            return html `
                <error-message> Error loading wishlist </error-message>
            `;
        }
        if (!this.currentBalance) return html `<p> Loading ... </p>`
        return html `
            <h1>Ønskelister:</h1>
            <button-element .buttonType="${ButtonType.navigate}" .action=${() => this.goBack()}>Tilbage</button-element><br>
            <button-element .buttonType="${ButtonType.confirm}" .action=${() => this.createWishList()}>Opret Ønskeliste</button-element><br>
            <section class="container">
                ${this.wishlist.map(wish => {
                    return html `
                        <wish-element .redeemAble="${this.currentBalance >= parseInt(wish.target_reward_balance)}" .wish=${wish} .parentView="${false}"></wish-element>
                    `
                })}
            </section>
        `;
    }

    getBalance() {
        console.log("Getting balance")
        getChildInfo(getCurrentUserId()).then((r : IApiResponse) =>{
            if(r.results !== null){
                let tempList:IAccountInfo[] = r.results;
                this.currentBalance = tempList[0].reward_balance;
            }
            if(r.error){
                alert("An error occured - Trying to redirect back to front page")
                this.goBack()
            }
        })
    }
}
