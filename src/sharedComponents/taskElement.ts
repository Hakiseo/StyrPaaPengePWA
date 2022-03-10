import {customElement, query, property} from "lit/decorators.js";
import {css, html, LitElement, TemplateResult} from "lit";
import {ITasklist} from "../childComponents/childInterfaces";
import {router} from "../index";

@customElement("task-element")
export class TaskElement extends LitElement {
    @property({type: Boolean}) parentView: boolean = false;
    @property({type: Boolean}) parentConfirmMode: boolean = false;

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

        .taskElement{
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

    @property({type: Object}) task!: ITasklist;
    @query('#img') image: any; //NO IDEA WHAT THIS IS!

    firstUpdated(){
        this.image.style.setProperty('--image-url',`url(${this.task.img})`)
    }

    render(): TemplateResult{
        if(!this.task){
            return html `Loading...`
        }else{
            console.log(this.task)
            console.log(this.task.current_status)
            return html`
                <article class="taskElement" style="${this.task.current_status == '1' ? `background-color:#006abf` : `background-color:#003865`}">
                    <div id="img" alt=${this.task.task_name}></div>

                    <h4>${this.task.current_status.length > 14 ? this.task.task_name.substring(0,14) : this.task.task_name.substring(0,11)}</h4>

                    
                        <!--<h4>${this.task.task_name.substring(0,14)}</h4>-->
                        <!--${this.task.current_status ? html `${this.task.current_status}<br><br>` : ''}-->
                    ${!this.parentView ? this.renderChild() : this.parentConfirmMode ? this.renderConfirmmode() : this.renderparent()}
                </article>
        `;
        }
    }

    renderConfirmmode(){
        return html`
            <a class="btn" @click=${() => this.navigateParentConfirm()}>Godkend</a>
        `;
    }

    renderparent(){
        return html`
            <a class="btn" @click=${() => this.navigateParent()}> ${this.task.current_status == '0' ? `Detaljer` : `Afventer`}</a>
        `;
    }

    renderChild(){
        return html`
            <a class="btn" @click=${() => this.navigateChild()}> ${this.task.current_status == '0' ? `Udfør` : `Afventer`}</a>
        `;
    }

    navigateParentConfirm(){
        router.navigate("/parentConfirm-task-detail/" + this.task.id);
    }

    navigateParent(){
        router.navigate("/parent-task-detail/" + this.task.id);
        //router.navigate("/wish-detail/" + this.wish.id + "/" + this.parentView);
    }

    navigateChild(){
        router.navigate("/child-task-detail/" + this.task.id);
        //router.navigate("/wish-detail/" + this.wish.id + "/" + this.parentView);
    }
}