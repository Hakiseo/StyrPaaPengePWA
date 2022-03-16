import {customElement, property} from "lit/decorators.js";
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
            .taskElement{
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
            .taskElement{
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

    @property({type: Object}) task!: ITasklist;

    render(): TemplateResult{
        if(!this.task){
            return html `Loading...`
        }else{
            return html`
                <article class="taskElement" 
                         style="${this.task.current_status == '1' ? `background-color:#FCA311` : `background-color:#14213D`}" 
                         @click="${() => !this.parentView ? this.navigateChild() : this.parentConfirmMode ? this.navigateParentConfirm() : this.navigateParent()}">
                    <img id="img" src="${this.task.img}" alt=${this.task.task_name}>

                    <h4 style="width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">${this.task.task_name}</h4>
                    
                    ${!this.parentView ? this.renderChild() : this.parentConfirmMode ? this.renderConfirmmode() : this.renderparent()}
                </article>
        `;
        }
    }

    renderConfirmmode(){
        return html`
            <p> ${this.task.done_status == '1' ? `Detaljer` : `Godkend`} </p>
        `;
    }

    renderparent(){
        return html`
            <p> ${this.task.current_status == '0' ? `Detaljer` : `Afventer`}</p>
        `;
    }

    renderChild(){
        return html`
            <p> ${this.task.current_status == '0' ? `Udfør` : `Afventer`}</p>
        `;
    }

    navigateParentConfirm(){
        router.navigate("/parentConfirm-task-detail/" + this.task.id);
    }

    navigateParent(){
        router.navigate("/parent-task-detail/" + this.task.id);
    }

    navigateChild(){
        router.navigate("/child-task-detail/" + this.task.id);
    }
}