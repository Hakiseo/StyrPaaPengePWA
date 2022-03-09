import {html, LitElement, TemplateResult} from "lit";
import {customElement} from "lit/decorators.js";

customElement("aside-menu")
export class SideMenu extends LitElement {
    protected render(): TemplateResult {
        return html `
            <button> TESTER </button>
            ${this.renderParentMenu()}
        `;
    }

    renderParentMenu(): TemplateResult {
        return html `
            <button> Indløste ønskelister </button>
            <button> Indløste opgaver </button>
            <button> Opgave oversigt </button>
            <button> Opret Opgave </button>
            <button> Egne detaljer </button>
            <button> Log Ud </button>
        `
    }

    renderJuniorMenu(): TemplateResult {
        return html `
            <button> Ønskeliste oversigt </button>
            <button> Opret ønskeliste </button>
            <button> Log Ud </button>
        `;
    }
}