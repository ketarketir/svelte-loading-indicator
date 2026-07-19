export interface TopLoaderProps {
	/**
	 * Color for the TopLoader.
	 * @default "#29d"
	 */
	color?: string;

	/**
	 * The initial position for the TopLoader in percentage, 0.08 is 8%.
	 * @default 0.08
	 */
	initialPosition?: number;

	/**
	 * The increment delay speed in milliseconds.
	 * @default 200
	 */
	crawlSpeed?: number;

	/**
	 * The height for the TopLoader in pixels (px).
	 * @default 3
	 */
	height?: number;

	/**
	 * Auto incrementing behaviour for the TopLoader.
	 * @default true
	 */
	crawl?: boolean;

	/**
	 * To show spinner or not.
	 * @default true
	 */
	showSpinner?: boolean;

	/**
	 * Easing function to use for the loader animation. Accepts any valid CSS easing string.
	 * @default "ease"
	 */
	easing?: string;

	/**
	 * Animation speed of the TopLoader in milliseconds.
	 * @default 200
	 */
	speed?: number;

	/**
	 * Defines a shadow for the TopLoader. Pass `false` to disable the shadow entirely.
	 * @default "0 0 10px {color},0 0 5px {color}"
	 */
	shadow?: string | false;

	/**
	 * Defines a custom HTML template for the TopLoader. Must contain an element with
	 * class `bar` for the progress track to work correctly.
	 * @default '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
	 */
	template?: string;

	/**
	 * Defines the z-index for the TopLoader.
	 * @default 1600
	 */
	zIndex?: number;

	/**
	 * To show the TopLoader at the bottom of the page instead of the top.
	 * @default false
	 */
	showAtBottom?: boolean;

	/**
	 * To show the TopLoader when navigating via a hash anchor (e.g. `#section`).
	 * @default true
	 */
	showForHashAnchor?: boolean;

	/**
	 * Nonce of the inline styles, for Content Security Policy (CSP) setups.
	 */
	nonce?: string;
}

export interface TopLoaderInstance {
	/** Starts the progress bar. */
	start: () => void;
	/** Completes the progress bar. Can be forced to complete immediately with `force`. */
	done: (force?: boolean) => void;
	/** Removes the progress bar element from the DOM. */
	remove: () => void;
	/** Manually sets the progress value (between 0.0 and 1.0). */
	setProgress: (value: number) => void;
	/** Increments the progress bar by a specified amount. Auto-increments if omitted. */
	inc: (amount?: number) => void;
	/** Adds a small random-ish increment to the progress bar. */
	trickle: () => void;
	/** Checks if the progress bar has been started. */
	isStarted: () => boolean;
	/** Checks if the progress bar is currently rendered. */
	isRendered: () => boolean;
	/** Returns the current progress value (0.0 - 1.0). Read-only, reactive. */
	readonly progress: number;
	/** Returns whether the bar is currently visible. Read-only, reactive. */
	readonly visible: boolean;
}

