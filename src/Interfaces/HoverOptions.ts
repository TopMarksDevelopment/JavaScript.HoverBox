import { CombinedAlignment, PositionAlignment, PositionCollision } from '@topmarksdevelopment/hover-position';

export default interface HoverOptions {
	setMy?: PositionAlignment;
	at?: PositionAlignment;
	keepOpen?: boolean;
	allowHtml?: boolean;
	transitionDelay?: number;
	transitionDuration?: number;

	// HoverPosition specific
	collision?: PositionCollision;
	bestFitPreference?: 'horizontal' | 'vertical';
	defaults?: { my: CombinedAlignment; at: CombinedAlignment };
}
