import { LitElement, TemplateResult } from 'lit';
import Navigo from "navigo";
import "./childComponents/childIndexPage";
import "./parentComponents/parentIndexPage";
export declare const router: Navigo;
export declare class IndexElement extends LitElement {
    get route(): void | TemplateResult<2 | 1>;
    set route(value: void | TemplateResult<2 | 1>);
    private _route;
    count: number;
    constructor();
    render(): TemplateResult<1>;
    countUp(): void;
    countDown(): void;
    renderHome(): TemplateResult<1>;
    render404(): TemplateResult<1>;
}
//# sourceMappingURL=index.d.ts.map