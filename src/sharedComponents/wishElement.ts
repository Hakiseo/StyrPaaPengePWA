import {customElement, property} from "lit/decorators.js";
import {css, html, LitElement, TemplateResult} from "lit";
import {router} from "../index";
import {IWishlist} from "./sharedInterfaces";
import {styleMap} from "lit/directives/style-map.js";

@customElement("wish-element")
export class WishElement extends LitElement {

    static styles = [css`
        h4{
            font-size: 15px;
        }
        #img{
            width:100%;
            height:90px;
            border-radius:12%;
            margin-bottom:10px;
            background-size:cover;
            background-image:var(--image-url);
            background-color:var(--color, #ccc);
            float:left;
            overflow:hidden;
        }
        .wishElement{
            color: #ffffff;
            position: relative;
            background-color: #003865;
            padding: 0.8rem;
            text-align: center;
            width: 90px;
            height:180px;
            border-radius: 25px;
            margin-bottom: 7px;
            margin-top: 7px;
        }
        
        @media screen and (min-width: 415px) {
            h4{
                font-size: 17px;
            }
            #img{
                width:100px;
                height:100px;
                border-radius:15%;
                margin-bottom:15px;
                background-size:cover;
                background-image:var(--image-url);
                background-color:var(--color, #ccc);
                float:left;
                overflow:hidden;
            }
            .wishElement{
                color: #ffffff;
                position: relative;
                background-color: #003865;
                padding: 1rem;
                text-align: center;
                max-width: 100px;
                min-width: 100px;
                max-height:200px;
                min-height:200px;
                border-radius: 30px;
                margin-bottom: 10px;
                margin-top: 10px;
            }
        }
        
        @media screen and (min-width: 540px) {
            #img{
                width:130px;
                height:130px;
                border-radius:15%;
                margin-bottom:20px;
                background-size:cover;
                background-image:var(--image-url);
                background-color:var(--color, #ccc);
                float:left;
                overflow:hidden;
            }
            .wishElement{
                color: #ffffff;
                position: relative;
                padding: 1rem;
                text-align: center;
                max-width: 130px;
                min-width: 130px;
                max-height:240px;
                min-height:240px;
                border-radius: 30px;
                margin-bottom: 10px;
                margin-top: 10px;
            }
        }
    `];

    @property({type: Boolean}) parentView: boolean = false;

    @property({type: Boolean}) redeemAble: boolean = false;

    @property({type: Object}) wish!: IWishlist;

    renderparent(){
        return html`
            <p> ${this.wish.done_status == '1' ? "Detaljer" : "Godkend"} </p>
        `;
    }

    renderChild(){
        return html`
            <p> ${this.wish.current_status == '0' || this.wish.done_status == '1' ? `Detaljer` : `Afventer`}</p>
        `;
    }

    navigateParent(){
        router.navigate("/parent-wish-detail/" + this.wish.id);
    }

    navigateChild(){
        router.navigate("/child-wish-detail/" + this.wish.id);
    }

    render(): TemplateResult{
        if(!this.wish){
            return html `Loading...`
        }else{
            const cardColors = {
                "background-color": this.redeemAble && this.wish.current_status == '0' ? "#289931" : this.wish.current_status == '1' ? "#FCA311" : "#14213D",
                // "background-color": this.wish.current_status == '1' ? "#FCA311" : "#14213D",
                // "border": this.redeemAble && this.wish.current_status == '0' ? "4px solid #289931;" : ""
            }
            return html`
                <article class="wishElement" 
                         style="${styleMap(cardColors)}" 
                         @click="${() => this.parentView ? this.navigateParent() : this.navigateChild()}">
                    <img id="img" src="${this.wish.img}" alt=${this.wish.saving_name}>
                    <h4 style="width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">${this.wish.saving_name}</h4>
                    ${this.parentView ? this.renderparent() : this.renderChild()}
                </article>
            `;

        }
    }
}
