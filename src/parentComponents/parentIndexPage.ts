import {customElement, property} from "lit/decorators.js";
import {html, LitElement, PropertyValues, TemplateResult} from "lit";
import {router} from "../index";
import "./childCard"
import {getCurrentUserId} from "../api/apiUtils";
import {fetchJuniors} from "../api/parentApiRequests";
import {ApiResponse} from "../sharedComponents/sharedInterfaces";
import {ChildData, MinimalChildrenData} from "./parentInterfaces";

@customElement("parent-index-page")
export class ParentIndexPage extends LitElement {
    @property({type: Number}) parentId!: number;
    @property() childrenData: ChildData[] = [];
    @property() minimalChildrenData: MinimalChildrenData[] = [];

    connectedCallback() {
        super.connectedCallback();
        this.parentId = Number.parseInt(getCurrentUserId());
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
            <button> Opgaver </button><br><br>
            
            ${this.renderJuniorUsers()} <br> <br>
            
            <button @click="${() => router.navigate("/parent/createChild")}"> Opret Junior Konto </button>
        `
    }

    renderWishListRedeemSection(): TemplateResult | void {
        return html `
            <div> 
                <h3> Indløste ønskelister: </h3> 
                <p>Tomy har en sektion han indsætter her</p>
            </div>
        `
    }

    renderTaskApprovalSection(): TemplateResult | void {
        return html `
            <div> 
                <h3> Opgaver til godkendelse: </h3>
                <p>Tomy har en sektion han indsætter her</p>
            </div>
        `
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