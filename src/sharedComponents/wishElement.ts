import {customElement, query, property} from "lit/decorators.js";
import {css, html, LitElement, TemplateResult} from "lit";
import {IWishlist} from "../childComponents/childInterfaces";
import {router} from "../index";

@customElement("wish-element")
export class WishElement extends LitElement {
    @property({type: Boolean}) parentView: boolean = false;

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
            color: #E5E5E5;
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
        .btn {
            color: #000000;
            padding: 5px 5px;
            text-align: center;
            border-radius: 20px;
            border: 2px solid #E5E5E5;
            background: #E5E5E5;
        }
        .btn:hover {
            color: white;
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
                color: #E5E5E5;
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
            .btn {
                color: #000000;
                padding: 7px 7px;
                text-align: center;
                border-radius: 25px;
                border: 2px solid #E5E5E5;
                background: #E5E5E5;
            }
            .btn:hover {
                color: white;
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
                color: #E5E5E5;
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
            .btn {
                color: #000000;
                padding: 7px 7px;
                text-align: center;
                border-radius: 25px;
                border: 2px solid #E5E5E5;
                background: #E5E5E5;
            }
        }
    `];

    @property({type: Object}) wish!: IWishlist;
    @query('#img') image: any; //NO IDEA WHAT THIS IS!

    firstUpdated(){
        this.image.style.setProperty('--image-url',`url(${this.wish.img})`)
    }

    renderparent(){
        return html`
            <a class="btn" @click=${() => this.navigateParent()}>Godkend</a>
        `;
    }

    renderChild(){
        return html`
            <a class="btn" @click=${() => this.navigateChild()}> ${this.wish.current_status == '0' ? `Detaljer` : `Afventer`}</a>
        `;
    }

    navigateParent(){
        router.navigate("/parent-wish-detail/" + this.wish.id);
        //router.navigate("/wish-detail/" + this.wish.id + "/" + this.parentView);
    }

    navigateChild(){
        router.navigate("/child-wish-detail/" + this.wish.id);
        //router.navigate("/wish-detail/" + this.wish.id + "/" + this.parentView);
    }

    render(): TemplateResult{
        if(!this.wish){
            return html `Loading...`
        }else{
            return html`
                <article class="wishElement" style="${this.wish.current_status == '1' ? `background-color:#FCA311` : `background-color:#14213D`}">
                    <div id="img" alt=${this.wish.saving_name}></div>
                    <h4>${this.wish.current_status.length > 14 ? this.wish.saving_name.substring(0,14) : this.wish.saving_name.substring(0,11)}</h4>
                    ${this.parentView ? this.renderparent() : this.renderChild()}
                </article>
            `;

        }
    }
}
