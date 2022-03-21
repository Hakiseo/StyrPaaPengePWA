import {customElement, property} from "lit/decorators.js";
import {html, LitElement, PropertyValues, TemplateResult} from "lit";

import {ButtonType, IApiResponse, IWishlist} from "./sharedInterfaces";
import {IAccountInfo} from "../childComponents/childInterfaces";
import {getWish, delete_Wish, confirm_Wish, update_Wish, retract_Wish, getChildInfo} from "../api/childApiRequests";
import {
    reject_WishParent,
    getWishParent,
    confirm_WishParent,
    fetchMinimalChild
} from "../api/parentApiRequests";
import { router } from "../index";
import "../childComponents/wishForm";
import {getCurrentUserId} from "../api/apiUtils";
import "./textDisplayElement"
import "./buttonElement"
import {IMinimalChildrenData} from "../parentComponents/parentInterfaces";

@customElement("wish-detail-page")
export class WishDetailPage extends LitElement {
    @property({type: Boolean}) parentView: boolean = false;
    @property({type: String}) errorMessage: string | null = "";

    @property() accountInfo!: IAccountInfo;
    @property() minChildData!: IMinimalChildrenData;
    @property() wish!: IWishlist;

    @property() wishID: string = "";
    @property() editMode: boolean = false;

    render() : TemplateResult{
        if(!this.wish) return html `Error loading wish data`;
        if(!this.parentView && !this.accountInfo) return html `Error loading account data`;
        return html`
            <h1>Ønskeliste:${this.wish.saving_name}</h1>
            <img src="${this.wish.img}" alt="Wish Icon" width="200" height="200"><br>
            ${this.parentView ? this.renderParentInfoForm() : this.editMode ? this.renderChildEditForm() : this.renderChildInfoForm()}
        `;
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (_changedProperties.has("wishID")) {
            this.loadWish();
        }
    }

    displayError(){
        window.alert(this.errorMessage)
        this.errorMessage = "";
    }

    loadWish(){
        this.getHandler().then((r : IApiResponse) => {
            if(r.results !== null){
                let tempWishList:IWishlist[] = r.results;
                this.wish = tempWishList[0]
            }
            if(r.error){
                this.errorMessage = "Error loading wish data..."
                this.displayError()
            }
            if(this.parentView && this.wish){
                this.loadChildData();
            }
        });
        if(!this.parentView){
            getChildInfo(getCurrentUserId()).then((r : IApiResponse) =>{
                if(r.results !== null){
                    let tempList:IAccountInfo[] = r.results;
                    this.accountInfo = tempList[0]
                }
                if(r.error){
                    this.errorMessage = "Error loading account data..."
                    this.displayError()
                }
            });
        }
    }

    getHandler(){
        if(this.parentView) {
            return getWishParent(this.wishID)
        }else{
            return getWish(this.wishID)
        }
    }

    loadChildData(){
        if(this.parentView && this.wish) {
            fetchMinimalChild(this.wish.creator_id).then((r : IApiResponse) =>{
                if(r.results !== null){
                    let tempList:any = r.results[0];
                    this.minChildData ={id:tempList.id, firstName:tempList.first_name, lastName:tempList.last_name}
                }
                if(r.error){
                    this.errorMessage = "Error loading child data..."
                    this.displayError()
                }
            })
        }
    }

    //TODO Parent:
    renderParentInfoForm(){
        if(!this.minChildData) return html `Error loading child data`;
        return html `
            <h2>Detaljer: </h2>
            <p-element> Barn: ${this.minChildData.firstName} ${this.minChildData.lastName}</p-element>
            <p-element> Beskrivelse: ${this.wish.content}</p-element>
            <p-element> Beløb: ${this.wish.target_reward_balance}</p-element>
            <button-element .buttonType="${ButtonType.navigate}" .action=${() => this.goBackParent()}>Tilbage</button-element> 
            ${this.renderParentInfoFormButtons()}
        `;
    }

    renderParentInfoFormButtons(): TemplateResult | void {
        if (this.wish.done_status == '1') return;
        return html `
            <button-element .buttonType="${ButtonType.deny}" .action=${() => this.rejectWishParent()}>Afvis</button-element>
            <button-element .buttonType="${ButtonType.confirm}" .action=${() => this.confirmWishParent()}>Godkend</button-element>
        `
    }

    goBackParent(){
        router.navigate("/parent")
    }

    rejectWishParent(){
        reject_WishParent(this.wish.id).then((r : IApiResponse) => {
            if(r.error){
                this.errorMessage = "Error rejecting wish..."
                this.displayError()
            }else{
                router.navigate("/parent");
            }
        })
    }

    confirmWishParent(){
        confirm_WishParent(this.wish.id).then((r : IApiResponse) => {
            if(r.error){
                this.errorMessage = "Error confirming wish..."
                this.displayError()
            }else{
                router.navigate("/parent");
            }
        })
    }

    //TODO Child:
    renderChildInfoForm() {
        return html `
            <p-element> Beskrivelse: ${this.wish.content} </p-element>
            <p-element> Beløb: ${this.wish.target_reward_balance} </p-element>
            <button-element .buttonType="${ButtonType.navigate}" .action=${() => this.goBackChild()}>Tilbage</button-element> 
            ${this.renderInfoForm()}
        `;
    }

    renderInfoForm(){
        if(!this.wish.current_status){
            return html `
                <button-element .buttonType="${ButtonType.confirm}" .action=${() => this.editMode = true}>Redigér Ønskeliste</button-element><br>
                <button-element .buttonType="${ButtonType.delete}" deleteMessage="Er du sikker på at du vil slette ønskelisten?" .action=${() => this.deleteWishChild()}>Slet Ønskeliste</button-element><br>
                ${Number(this.accountInfo.reward_balance) >= Number(this.wish.target_reward_balance) ? html`<button-element .buttonType="${ButtonType.confirm}" .action=${() => this.confirmWishChild()}>Indløs</button-element><br>` : ''}
            `;
        } else {
            if (this.wish.done_status) return;
            return html`<button-element .buttonType="${ButtonType.deny}" .action=${() => this.retractWishChild()}>Annullér indløsning</button-element><br>`
        }
    }

    renderChildEditForm() {
        return html `
            <button-element .buttonType="${ButtonType.navigate}" .action=${() => this.goBackChild()}>Tilbage</button-element><br>
            <wish-form .detailForm="${true}"
                       .wishListName="${this.wish.saving_name}"
                       .wishListContent="${this.wish.content}"
                       .wishListTarget="${this.wish.target_reward_balance}"
                       @submit="${(e: CustomEvent) => {this.updateWishChild(e);}}"
            ></wish-form>
            <button-element .buttonType="${ButtonType.navigate}" .action=${this.editMode = false, () => this.loadWish()}>Annullere</button-element><br>
        `;
    }

    goBackChild(){
        router.navigate("/wishlist-overview")
    }

    updateWishChild(e : CustomEvent){
        if (e.detail.wishListName && e.detail.wishListContent && e.detail.wishListTarget) {
            update_Wish({
                id: this.wish.id,
                saving_name: e.detail.wishListName,
                content: e.detail.wishListContent,
                target_reward_balance: e.detail.wishListTarget
            }).then((r : IApiResponse) => {
                if(r.error){
                    this.errorMessage = "Error updating wish..."
                    this.displayError()
                }else{
                    this.editMode = false;
                }
                this.loadWish();
            })
        }else{
            window.alert("No fields may be left empty'!");
        }
    }

    retractWishChild(){
        retract_Wish(this.wish.id).then((r : IApiResponse) => {
            if(r.error){
                this.errorMessage = "Error rejecting wish..."
                this.displayError()
            }else{
                this.goBackChild()
            }
        })
    }

    confirmWishChild(){
        confirm_Wish(this.wish.id).then((r : IApiResponse) => {
            if(r.error){
                this.errorMessage = "Error confirming wish..."
                this.displayError()
            }else{
                this.goBackChild()
            }
        })
    }

    deleteWishChild(){
        delete_Wish(this.wish.id).then((r : IApiResponse) => {
            if(r.error){
                this.errorMessage = "Error deleting wish..."
                this.displayError()
            }else{
                this.goBackChild()
            }
        })
    }
}
