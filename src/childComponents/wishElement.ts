import {customElement, query, property} from "lit/decorators.js";
import {css, html, LitElement, TemplateResult} from "lit";
import {IWishlist} from "./childInterfaces";

@customElement("wish-element")
export class WishElement extends LitElement {

    static styles = [css`

        :host{
            display:block;
            clear:both;
        }

        h5{
            font-size:1.3rem;
        }

        #img{
            width:200px;
            height:120px;
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
            max-width: 200px;
            min-width: 200px;
            max-height:350px;
            min-height:350px;
            border-radius: 30px;
            margin-bottom: 20px;
            margin-top: 20px;
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
        this.image.style.setProperty('--image-url',`url(${this.wish.image})`)
    }

    render(): TemplateResult{
        if(!this.wish){
            return html `Loading...`
        }else{
            console.log(this.wish)
            return html`
                
                <h>${this.wish.savingName}</h>
                
                <article class="wishElement">
                    <div id="img" alt=${this.wish.savingName}></div>
                    <h5>${this.wish.savingName}</h5>
                    ${this.wish.currentStatus ? html `${this.wish.currentStatus}<br><br>` : ''}
                    <a class="btn" href= "/wish-detail/${this.wish.id}">Se mere</a>
                </article>
                
                
        `;
        }
    }
}
