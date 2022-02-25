import {LitElement, html, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import Navigo from "navigo";
import "./childComponents/childIndexPage";
import "./parentComponents/parentIndexPage";

export const router = new Navigo('/');

@customElement('index-element')
export class IndexElement extends LitElement {
    get route() {
        return this._route;
    }

    set route(value) {
        this._route = value;
    }

    @property() private _route!: TemplateResult | void;

    @property({type: Number}) count = 0;

    constructor() {
        super();
        router
            .on("/parent", () => {this.route = html`<parent-index-page></parent-index-page>`})
            .on("/parent/:id", (match: any) => {console.log("Match object from Navigo router: ", match); this.route = html`<parent-index-page .parentId="${match.data.id}"></parent-index-page>`})
            .on("/child", () => {this.route = html`<child-index-page></child-index-page>`})
            .on("/main", () => {this.route = this.renderHome()})
            .on("*", () => {setTimeout(() => this.route = this.render404(), 200)})
        ;

        if (window.location.href == "http://localhost:8000/") {
            router.navigate("/main")
        }

        router.resolve();
    }

    render() {
        return html `
            ${this.route}
        `
    }

    countUp() {
        this.count++
    }

    countDown() {
        this.count--
    }

    renderHome() {
        return html`
            <h1> WHATS UP MOTHER FUCKERS I CAN COUNT UP AND DOWN!!! </h1>
            <button @click="${() => this.countUp()}"> Count up </button>
            <button @click="${() => this.countDown()}"> Count down </button>
            <h2>Counter: ${this.count}</h2>
            <h1>AMAZinG!!!</h1>
            <button @click="${() => router.navigate("parent")}"> Go To Parent index </button>
            <button @click="${() => router.navigate("parent/1")}"> Go To Parent 1 index </button>
            <button @click="${() => router.navigate("child")}"> Go To Child index </button>
        `;
    }

    render404() {
        return html ` 
      <div class="w3-container">
        <h2> 404 - Not found </h2>
        <button class="w3-button w3-blue-gray" @click="${() => router.navigate("/main")}"> Go back to main page </button> 
      </div>
    `
    }
}
