import { LitElement, TemplateResult } from 'lit';
import Navigo from "navigo";
import "./childComponents/childIndexPage";
import "./parentComponents/parentIndexPage";
import "./home";
export declare const router: Navigo;
export declare class IndexElement extends LitElement {
    get route(): void | TemplateResult<2 | 1>;
    set route(value: void | TemplateResult<2 | 1>);
    private _route;
    count: number;
    constructor();
    render(): TemplateResult;
    render404(): TemplateResult<1>;
}
//# sourceMappingURL=index.d.ts.map