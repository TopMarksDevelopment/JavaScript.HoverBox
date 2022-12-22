import {
    CombinedAlignment,
    Alignment,
    CollisionHandler,
} from '@topmarksdevelopment/position';

export interface HoverOptions {
    setMy?: Alignment;
    at?: Alignment;
    keepOpen?: boolean;
    allowHtml?: boolean;
    transitionDelay?: number;
    transitionDuration?: number;

    // HoverPosition specific
    collision?: CollisionHandler;
    bestFitPreference?: 'horizontal' | 'vertical';
    defaults?: { my: CombinedAlignment; at: CombinedAlignment };
}
