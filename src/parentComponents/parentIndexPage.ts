import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, PropertyValues, TemplateResult} from "lit";
import {router} from "../index";
import "./childCard"
import {getCurrentUserId} from "../api/apiUtils";
import {fetchJuniors, getConfirmedTasklistParent, getConfirmedWishlistParent} from "../api/parentApiRequests";
import {ApiResponse} from "../sharedComponents/sharedInterfaces";
import {ChildData, MinimalChildrenData, ITasklist, IWishlist} from "./parentInterfaces";
//import {} from "../childComponents/childInterfaces";

@customElement("parent-index-page")
export class ParentIndexPage extends LitElement {
    @property({type: String}) parentId!: string;
    @property() childrenData: ChildData[] = [];
    @property() minimalChildrenData: MinimalChildrenData[] = [];
    @property() wishlist!: IWishlist[];
    @property() tasklist!: ITasklist[];
    @property({type: String}) errorWishMessage: string | null = "";
    @property({type: String}) errorTaskMessage: string | null = "";

    connectedCallback() {
        super.connectedCallback();
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (_changedProperties.has("parentId") && this.parentId) {
            fetchJuniors(this.parentId).then((r: ApiResponse) => {
                if (!r.error && r.results) {
                    this.childrenData = r.results
                    this.minimalChildrenData = this.childrenData.map(r => {
                        return {id: r.id, name: r.first_name + " " + r.last_name}
                    })
                }
            })
        }
        if (_changedProperties.has("minimalChildrenData") && this.minimalChildrenData.length > 0) {
            this.dispatchEvent(new CustomEvent("indexEmitMinimalChildrenData", {detail: this.minimalChildrenData}))
        }
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
        getConfirmedWishlistParent(this.parentId).then((r : ApiResponse) =>{
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
        getConfirmedTasklistParent(this.parentId).then((r : ApiResponse) =>{
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

    renderJuniorUsers(): TemplateResult | void {
        if (this.childrenData.length === 0) return;
        //Add loop here for all juniors and route on click to user id
        return html `
            <div>
                ${this.childrenData.map((d: ChildData) => {
                    return html `
                        <junior-card .firstName="${d.first_name}" .lastName="${d.last_name}" @click="${() => this.navigateToChild(d.id)}"></junior-card>
                    `
                })}
            </div>
        `
    }

    navigateToChild(id: number) {
        this.emitChildData(id)
        router.navigate("/parent/childDetails/" + id)
    }

    emitChildData(id: number) {
        //This is made to avoid unecessary new request
        this.dispatchEvent(new CustomEvent("indexEmitChildData", {detail: this.childrenData.find(r => r.id === id)}))
    }
}