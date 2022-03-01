import {customElement, property} from "lit/decorators.js";
import {html, LitElement, TemplateResult} from "lit";
import {router} from "./index";
import {getAllParent, postParent} from "./api/parentApiRequests";
import {getAllChildren} from "./api/childApiRequests";

@customElement('home-element')
export class Home extends LitElement {
    @property({type: Number}) count = 0;

    countUp(): void {
        this.count++;
    }

    countDown(): void {
        this.count--;
    }

    render(): TemplateResult {
        return html `
            <h1> WHATS UP MOTHER FUCKERS I CAN COUNT UP AND DOWN!!! </h1>
            <button @click="${() => this.countUp()}"> Count up </button>
            <button @click="${() => this.countDown()}"> Count down </button>
            <h2>Counter: ${this.count}</h2>
            <h1>AMAZinG!!!</h1>
            <button @click="${() => router.navigate("parent")}"> Go To Parent index </button>
            <button @click="${() => router.navigate("parent/1")}"> Go To Parent 1 index </button>
            <button @click="${() => router.navigate("child")}"> Go To Child index </button>
            <button @click="${() => getAllChildren().then(r => console.log(r))}"> Get Children </button>
            <button @click="${() => getAllParent().then(r => console.log(r))}"> Get Parents </button>
            <button @click="${() => postParent()}"> Post test parent </button>
        `;
    }
}