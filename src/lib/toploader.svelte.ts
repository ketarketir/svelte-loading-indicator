import type { TopLoaderInstance } from './types.js';

interface Settings {
	minimum: number;
	crawlSpeed: number;
	crawl: boolean;
	speed: number;
	easing: string;
}

/**
 * Internal reactive controller for the TopLoader progress bar.
 * Built with Svelte 5 runes so any component reading `.progress` / `.visible`
 * re-renders automatically — no external store subscription needed.
 */
class TopLoaderStore {
	progress = $state(0);
	visible = $state(false);

	#settings: Settings = {
		minimum: 0.08,
		crawlSpeed: 200,
		crawl: true,
		speed: 200,
		easing: 'ease'
	};

	#crawlTimer: ReturnType<typeof setInterval> | null = null;
	#removeTimer: ReturnType<typeof setTimeout> | null = null;

	/** @internal used by <TopLoader /> to sync props into the controller */
	configure(
		opts: Partial<{
			initialPosition: number;
			crawlSpeed: number;
			crawl: boolean;
			speed: number;
			easing: string;
		}>
	) {
		if (opts.initialPosition !== undefined) this.#settings.minimum = opts.initialPosition;
		if (opts.crawlSpeed !== undefined) this.#settings.crawlSpeed = opts.crawlSpeed;
		if (opts.crawl !== undefined) this.#settings.crawl = opts.crawl;
		if (opts.speed !== undefined) this.#settings.speed = opts.speed;
		if (opts.easing !== undefined) this.#settings.easing = opts.easing;
	}

	isStarted(): boolean {
		return this.visible;
	}

	isRendered(): boolean {
		return this.visible;
	}

	getPositioningCSS(): string {
		return 'translate3d';
	}

	start(): void {
		this.#clearTimers();
		this.visible = true;
		this.setProgress(this.#settings.minimum);
		if (this.#settings.crawl) this.#startCrawl();
	}

	inc(amount?: number): void {
		let n = this.progress;
		if (!this.visible || n >= 1) return;

		if (amount === undefined) {
			if (n >= 0 && n < 0.2) amount = 0.1;
			else if (n >= 0.2 && n < 0.5) amount = 0.04;
			else if (n >= 0.5 && n < 0.8) amount = 0.02;
			else if (n >= 0.8 && n < 0.99) amount = 0.005;
			else amount = 0;
		}

		this.setProgress(n + amount);
	}

	trickle(): void {
		this.inc();
	}

	setProgress(value: number): void {
		const clamped = Math.max(0, Math.min(1, value));
		this.progress = clamped;
		if (!this.visible && clamped > 0) this.visible = true;
	}

	done(force = false): void {
		if (this.#crawlTimer) {
			clearInterval(this.#crawlTimer);
			this.#crawlTimer = null;
		}

		if (!force && this.progress === 0) return;

		this.setProgress(1);

		if (this.#removeTimer) clearTimeout(this.#removeTimer);
		this.#removeTimer = setTimeout(() => {
			this.remove();
		}, this.#settings.speed);
	}

	remove(): void {
		this.#clearTimers();
		this.visible = false;
		this.progress = 0;
	}

	#startCrawl(): void {
		this.#crawlTimer = setInterval(() => {
			this.inc();
		}, this.#settings.crawlSpeed);
	}

	#clearTimers(): void {
		if (this.#crawlTimer) {
			clearInterval(this.#crawlTimer);
			this.#crawlTimer = null;
		}
		if (this.#removeTimer) {
			clearTimeout(this.#removeTimer);
			this.#removeTimer = null;
		}
	}
}

/** Singleton instance shared by <TopLoader /> and useTopLoader(). */
export const topLoader = new TopLoaderStore();

/**
 * Hook-like accessor for manually controlling the TopLoader from anywhere
 * in your app, mirroring `useTopLoader()` from nextjs-toploader.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useTopLoader } from 'sveltekit-toploader';
 *   const loader = useTopLoader();
 * </script>
 * <button onclick={() => loader.start()}>Start</button>
 * <button onclick={() => loader.setProgress(0.5)}>Set Progress</button>
 * ```
 */
export function useTopLoader(): TopLoaderInstance {
	return topLoader;
}
