import {customElement, query, property} from "lit/decorators.js";
import {css, html, LitElement, TemplateResult} from "lit";
import {IWishlist} from "../childComponents/childInterfaces";
import {router} from "../index";

@customElement("wish-element")
export class WishElement extends LitElement {
    @property({type: Boolean}) parentView: boolean = false;

    static styles = [css`

        :host{
            display:block;
            clear:both;
        }

        h5{
            font-size:1.3rem;
        }

        #img{
            width:100px;
            height:100px;
            border-radius:15%;
            margin-bottom:20px;
            background-size:cover;
            background-image:var(--image-url);
            background-color:var(--color, #ccc);
            float:left;
            overflow:hidden;
        }

        .wishElement{
            color: white;
            position: relative;
            background-color: #003865;
            padding: 2rem;
            text-align: center;
            max-width: 100px;
            min-width: 100px;
            max-height:240px;
            min-height:240px;
            border-radius: 30px;
            margin-bottom: 10px;
            margin-top: 10px;
        }

        .btn {
            color: white;
            padding: 7px 7px;
            text-align: center;
            border-radius: 25px;
            border: 2px solid #2a9fd8;
            background: #2a9fd8;
        }

        .btn2 {
            color: white;
            padding: 7px 7px;
            text-align: center;
            border-radius: 25px;
            border: 2px solid #2a9fd8;
            background: #2a9fd8;
            margin-top: 6px;
            margin-bottom: 14px;
        }
  
        .btn:hover {
            color: white;
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
                <article class="wishElement" style="${this.wish.current_status == '1' ? `background-color:#006abf` : `background-color:#003865`}">
                    <div id="img" alt=${this.wish.saving_name}></div>
                    <h4>${this.wish.current_status.length > 14 ? this.wish.saving_name.substring(0,14) : this.wish.saving_name.substring(0,11)}</h4>
                    ${this.parentView ? this.renderparent() : this.renderChild()}
                </article>
            `;

        }
    }
}
