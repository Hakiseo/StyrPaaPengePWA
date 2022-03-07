import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, TemplateResult} from "lit";
import {router} from "../index";
import {getConfirmedTasklistParent, getConfirmedWishlistParent} from "../api/parentApiRequests";
import {apiResponse} from "../sharedComponents/sharedInterfaces";
import {ITasklist, IWishlist} from "../childComponents/childInterfaces";
import {getCurrentUserId} from "../api/apiUtils";

@customElement("parent-index-page")
export class ParentIndexPage extends LitElement {
    @property() wishlist!: IWishlist[];
    @property() tasklist!: ITasklist[];
    @property({type: String}) errorWishMessage: string | null = "";
    @property({type: String}) errorTaskMessage: string | null = "";
    @property({type: String}) parentId!: string;

    connectedCallback() {
        super.connectedCallback();
        //Check and validate token with an api-call to see if we have access to the site
    }

    protected render(): TemplateResult {
        return html `
            <h1> Hello from Parent Index Page! </h1>
            ${this.parentId ? html`<h2> Parent Id: ${this.parentId}</h2>` : ''}
            ${this.renderWishListRedeemSection()}
            ${this.renderTaskApprovalSection()}
            <button @click="${() => router.navigate("/tasklist-overview")}"> Opgaver </button>
            ${this.renderJuniorUsers()}
            <button @click="${() => router.navigate("/parent/createChild")}"> Opret Junior Konto </button>
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
        this.parentId = getCurrentUserId();
        getConfirmedWishlistParent(this.parentId).then((r : apiResponse) =>{
            if (r.results !== null) {
                this.wishlist = r.results
            }else{
                this.errorWishMessage = r.error
            }
            if(this.errorWishMessage){
                this.renderWishError()
            }
            console.log(this.wishlist)
            //this.errorMessage = "r.error" //simulerer at der er en error besked
        })
        getConfirmedTasklistParent(this.parentId).then((r : apiResponse) =>{
            if (r.results !== null) {
                this.tasklist = r.results
            }else{
                this.errorTaskMessage = r.error
            }
            if(this.errorTaskMessage){
                this.renderTaskError()
            }
            console.log(this.tasklist)
            //this.errorMessage = "r.error" //simulerer at der er en error besked
        })
    }

    renderWishError(){
        return html `
            <p> ${this.errorWishMessage} </p>
            <p> Error loading task info... </p>
        `;
    }

    renderTaskError(){
        return html `
            <p> ${this.errorTaskMessage} </p>
            <p> Error loading task info... </p>
        `;
    }

    renderWishListRedeemSection(): TemplateResult | void {
        if(this.wishlist){
            return html `
                <div>
                    <h3> Indløste ønskelister: </h3>
                </div>
                <section class="container">
                    ${this.wishlist.map(wish => {
                        console.log(wish)
                        return html `
                            <wish-element .wish=${wish} .parentView="${true}"></wish-element>
                        `
                    })}
                </section>
            `;
        }else{
            return html `
                <div>
                    <h3> Indløste ønskelister: </h3>
                </div>
                <p> Error loading Wishlist...</p>
            `;
        }
    }

    renderTaskApprovalSection(): TemplateResult | void {
        if(this.tasklist){
            return html `
                <div>
                    <h3> Opgaver til godkendelse: </h3>
                </div>
                <section class="container">
                    ${this.tasklist.map(task => {
                console.log(task)
                return html `
                        <task-element .task=${task} .parentView="${true}" .parentConfirmMode="${true}"></task-element>
                    `
                })}
                </section>
            `;
        }else{
            return html `
                <div>
                    <h3> Opgaver til godkendelse: </h3>
                </div>
                <p> Error loading Tasklist...</p>
            `;
        }
    }

    renderJuniorUsers() {
        return html `
            <div> Junior 1 </div>
            <div> Junior 2 </div>
            <div> Junior 3 </div>
        `
    }
}