import {css, html, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {BaseStyleElement} from "./BaseStyleElement";
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import {router} from "../index";

@customElement("side-menu")
export class SideMenu extends BaseStyleElement {

    @property() parentUser: boolean = false;
    @property() loggedIn: boolean = false;
    @property() showMenu: boolean = false;

    static get styles() {
        return [
            super.styles, //Externally imported styles
            css`
            /*https://www.w3schools.com/howto/howto_css_menu_icon.asp*/
.container {
    display: inline-block;
    cursor: pointer;
}

.bar1, .bar2, .bar3 {
    width: 35px;
    height: 5px;
    background-color: #333;
    margin: 6px 0;
    transition: 0.4s;
}

/* Rotate first bar */
.change .bar1 {
    -webkit-transform: rotate(-45deg) translate(-9px, 6px) ;
    transform: rotate(-45deg) translate(-9px, 6px) ;
}

/* Fade out the second bar */
.change .bar2 {
    opacity: 0;
}

/* Rotate last bar */
.change .bar3 {
    -webkit-transform: rotate(45deg) translate(-8px, -8px) ;
    transform: rotate(45deg) translate(-8px, -8px) ;
}

/*https://www.w3schools.com/howto/howto_js_sidenav.asp*/
/* The side navigation menu */
.sidenav {
    height: 100%; /* 100% Full-height */
    width: 0; /* 0 width - change this with JavaScript */
    position: fixed; /* Stay in place */
    z-index: 1; /* Stay on top */
    top: 0; /* Stay at the top */
    left: 0;
    background-color: #111; /* Black*/
    overflow-x: hidden; /* Disable horizontal scroll */
    padding-top: 60px; /* Place content 60px from the top */
    transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
}

/* The navigation menu links */
.sidenav p {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 25px;
    color: #818181;
    display: block;
    transition: 0.3s;
    cursor: pointer;
    margin: 0;
}

/* When you mouse over the navigation links, change their color */
.sidenav p:hover {
    color: #f1f1f1;
}

/* Position and style the close button (top right corner) */
.sidenav .closebtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 36px;
    margin-left: 50px;
}

/* Style page content - use this if you want to push the page content to the right when you open the side navigation */
#main {
    transition: margin-left .5s;
    padding: 20px;
}

/* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */
@media screen and (max-height: 450px) {
    .sidenav {padding-top: 15px;}
    .sidenav a {font-size: 18px;}
}
            ` //The components own individual styles
        ]
    }

    connectedCallback() {
        super.connectedCallback();
    }

    protected render(): TemplateResult | void {
        if (!this.loggedIn) return;
        return html `
            <div class="container ${classMap({change: this.showMenu})}" @click="${() => this.showMenu = !this.showMenu}">
                <div class="bar1"></div>
                <div class="bar2"></div>
                <div class="bar3"></div>
            </div>

            <div id="mySidenav" class="sidenav" style="${styleMap({width: this.showMenu ? "250px" : "0px"})}">
                <p class="closebtn" @click="${() => this.showMenu = false}">&times;</p>
                ${this.renderMenuItems()}
            </div>
        `;
    }

    renderMenuItems(): TemplateResult {
        if (this.parentUser) {
            return this.renderParentMenu()
        }
        return this.renderJuniorMenu()
    }

    renderParentMenu(): TemplateResult {
        return html `
            <p @click="${() => this.menuNavigate("/home")}"> Index </p>
            <p> Indløste ønskelister </p>
            <p> Indløste opgaver </p>
            <p> Opgave oversigt </p>
            <p> Opret Opgave </p>
            <p @click="${() => this.menuNavigate("/parent/details")}"> Egne detaljer </p>
            <p @click="${() => this.emitLogout()}"> Log Ud </p>
        `
    }

    renderJuniorMenu(): TemplateResult {
        return html `
            <p> Ønskeliste oversigt </p>
            <p> Opret ønskeliste </p>
            <p @click="${() => this.emitLogout()}"> Log Ud </p>
        `;
    }

    menuNavigate(path: string) {
        router.navigate(path);
        this.showMenu = false;
    }

    emitLogout() {
        this.dispatchEvent(new CustomEvent("logout"))
    }
}