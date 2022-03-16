import {customElement, query, property} from "lit/decorators.js";
import {css, html, LitElement, TemplateResult} from "lit";
import {ITasklist} from "./sharedInterfaces";
import {router} from "../index";

@customElement("task-element")
export class TaskElement extends LitElement {
    @property({type: Boolean}) parentView: boolean = false;
    @property({type: Boolean}) parentConfirmMode: boolean = false;

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
        .taskElement{
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
            .taskElement{
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
            .taskElement{
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

    @property({type: Object}) task!: ITasklist;
    @query('#img') image: any; //NO IDEA WHAT THIS IS!

    firstUpdated(){
        this.image.style.setProperty('--image-url',`url(${this.task.img})`)
    }

    render(): TemplateResult{
        if(!this.task){
            return html `Loading...`
        }else{
            return html`
                <article class="taskElement" style="${this.task.current_status == '1' ? `background-color:#FCA311` : `background-color:#14213D`}">
                    <div id="img" alt=${this.task.task_name}></div>

                    <h4>${this.task.current_status.length > 14 ? this.task.task_name.substring(0,14) : this.task.task_name.substring(0,11)}</h4>
                    
                    ${!this.parentView ? this.renderChild() : this.parentConfirmMode ? this.renderConfirmmode() : this.renderparent()}
                </article>
        `;
        }
    }

    renderConfirmmode(){
        return html`
            <a class="btn" @click=${() => this.navigateParentConfirm()}> ${this.task.done_status == '1' ? `Detaljer` : `Godkend`} </a>
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