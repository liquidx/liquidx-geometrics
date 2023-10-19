/** @typedef {typeof __propDef.props}  GeometricsIndexProps */
/** @typedef {typeof __propDef.events}  GeometricsIndexEvents */
/** @typedef {typeof __propDef.slots}  GeometricsIndexSlots */
export default class GeometricsIndex extends SvelteComponent<{
    pieces: any;
}, {
    pieceDidSelect: CustomEvent<any>;
} & {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type GeometricsIndexProps = typeof __propDef.props;
export type GeometricsIndexEvents = typeof __propDef.events;
export type GeometricsIndexSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        pieces: any;
    };
    events: {
        pieceDidSelect: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
