import {customElement, property} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";

import {apiResponse} from "../sharedComponents/sharedInterfaces";
import {create_Wishlist} from "../api/childApiRequests";
import { router } from "../index";

@customElement("wish-create-page")
export class WishCreatePage extends LitElement {

    @property({type: String}) createID: string = "";
    @property({type: String}) name: string = "";
    @property({type: String}) content: string = "";
    @property({type: String}) target: string = "";

    @property({type: String}) errorMessage: string | null = "";

    constructor() {
        super();
    }

    render(): TemplateResult{
        return html`
            <h1>Opret Ønskeliste:</h1>
            <button @click=${() => this.goBack()}>Tilbage</button><br>
            <div> 
                <form>
                    <label> CreateID: </label>
                    <br>
                    <input class="w3-input w3-border w3-light-grey" style="max-width: 140px" 
                    type="text" @change=${(e:any) => this.createID = e.target.value}>
                    <br>
                    <label> Name: </label>
                    <br>
                    <input class="w3-input w3-border w3-light-grey" style="max-width: 140px" 
                    type="text" @change=${(e:any) => this.name = e.target.value}>
                    <br>
                    <label> Content: </label>
                    <br>
                    <input class="w3-input w3-border w3-light-grey" style="max-width: 140px" 
                    type="text" @change=${(e:any) => this.content = e.target.value}>
                    <br>
                    <label> Target: </label>
                    <br>
                    <input class="w3-input w3-border w3-light-grey" style="max-width: 140px" 
                    type="text" @change=${(e:any) => this.target = e.target.value}>
                </form>
                <br>
                <button class="w3-btn w3-margin-left w3-margin-right w3-blue w3-border w3-border-blue w3-round w3-right"
                    @click="${() => this.createWishList()}"> Opret </button>
            </div>
        `;
    }

    createWishList(){
        if (this.createID && this.name && this.content && this.target) {
            create_Wishlist(this.createID, this.name, this.content, this.target).then((r : apiResponse) => {
                this.errorMessage = r.error
                // this.errorMessage = "r.error" //simulerer at der er en error besked
            })
            if(this.errorMessage) {
                window.alert("Fejl... " + this.errorMessage)
            }else{
                window.alert("Oprettet Ønskeliste: " + this.name);
                this.resetWishCreation();
            }
        }else{
            window.alert("No fields may be left empty'!");
        }
    }

    resetWishCreation() {
        this.createID = "";
        this.name = "";
        this.content = "";
        this.target = "";
    }

    goBack(){
        router.navigate("/wishlist-overview")
    }
}
