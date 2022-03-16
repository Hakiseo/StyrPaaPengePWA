import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, PropertyValues, TemplateResult} from "lit";
import {router} from "../index";
import "./childCard"
import {getCurrentUserId} from "../api/apiUtils";
import {fetchJuniors, getConfirmedTasklistParent, getConfirmedWishlistParent} from "../api/parentApiRequests";
import {ButtonType, IApiResponse, ITasklist, IWishlist} from "../sharedComponents/sharedInterfaces";
import {IChildData, IMinimalChildrenData} from "./parentInterfaces";
import "../sharedComponents/buttonElement";
import "../sharedComponents/errorMessage"

@customElement("parent-index-page")
export class ParentIndexPage extends LitElement {
    @property({type: String}) parentId!: string;
    @property() childrenData: IChildData[] = [];
    @property() minimalChildrenData: IMinimalChildrenData[] = [];
    @property() wishlist!: IWishlist[];
    @property() tasklist!: ITasklist[];
    @property({type: String}) errorMessage: string | null = "";

    connectedCallback() {
        super.connectedCallback();
    }

    protected updated(_changedProperties: PropertyValues){
        super.updated(_changedProperties);
        if (_changedProperties.has("parentId") && this.parentId){
            fetchJuniors(this.parentId).then((r: IApiResponse) => {
                if (!r.error && r.results){
                    this.childrenData = r.results
                    this.minimalChildrenData = this.childrenData.map(r => {
                        return {id: r.id, firstName: r.first_name, lastName: r.last_name}
                    })
                }
            })
        }
        if (_changedProperties.has("minimalChildrenData") && this.minimalChildrenData.length > 0) {
            this.dispatchEvent(new CustomEvent("indexEmitMinimalChildrenData", {detail: this.minimalChildrenData}))
        }
    }

    displayError(){
        window.alert(this.errorMessage)
        this.errorMessage = "";
    }

    protected render(): TemplateResult {
        return html `
            <h1> Hello from Parent Index Page! </h1>
            ${this.parentId ? html`<h2> Parent Id: ${this.parentId}</h2>` : ''}
            ${this.renderWishListRedeemSection()}
            ${this.renderTaskApprovalSection()}
            <button-element .buttonType="${ButtonType.navigate}" .action="${() => router.navigate("/tasklist-overview")}"> Opgaver </button-element>
            ${this.renderJuniorUsers()}
            <button-element .buttonType="${ButtonType.confirm}" .action="${() => router.navigate("/parent/createChild")}"> Opret Junior Konto </button-element>
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
        getConfirmedWishlistParent(this.parentId).then((r : IApiResponse) =>{
            if (r.results !== null) {
                this.wishlist = r.results
            }
            if(r.error){
                this.errorMessage = "Error loading wishlist data..."
                this.displayError()
            }
        })
        getConfirmedTasklistParent(this.parentId).then((r : IApiResponse) =>{
            if (r.results !== null) {
                this.tasklist = r.results
            }
            if(r.error){
                this.errorMessage = "Error loading tasklist data..."
                this.displayError()
            }
        })
    }

    renderWishListRedeemSection(): TemplateResult | void {
        if(this.wishlist){
            return html `
                <div>
                    <h3> Indløste ønskelister: </h3>
                </div>
                <section class="container">
                    ${this.wishlist.map(wish => {
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
                <error-message> Error loading Wishlist </error-message>
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
                <error-message> Error loading Tasklist... </error-message>
            `;
        }
    }

    renderJuniorUsers(): TemplateResult | void {
        if (this.childrenData.length === 0) return;
        //Add loop here for all juniors and route on click to user id
        return html `
            <div style="display: flex; flex-wrap: wrap; justify-content: center">
                ${this.childrenData.map((d: IChildData) => {
                    return html `
                        <junior-card .data="${d}" @click="${() => this.navigateToChild(d.id)}"></junior-card>
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
