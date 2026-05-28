<script>
	import { base } from "$app/paths";
	import wordmark from "$svg/Not1More.svg";

	const nav = [
		{ id: "map", label: "Map" },
		{ id: "stories", label: "Stories" },
		{ id: "resources", label: "Resources" },
		{ id: "acknowledgements", label: "Credits" }
	];

	let active = "map";

	function goTo(id) {
		active = id;

		const el = document.getElementById(id);
		if (!el) return;

		el.scrollIntoView({ behavior: "smooth", block: "start" });
	}
</script>

<header class="header">
	<div class="wordmark">
		<a href="{base}/" aria-label="home">
			{@html wordmark}
		</a>
	</div>

	<nav class="nav">
		{#each nav as item}
			<button
				class:selected={active === item.id}
				on:click={() => goTo(item.id)}
			>
				{item.label}
			</button>
		{/each}
	</nav>
</header>

<style>

.header {
	background: #0a061b;
	color: white;
	padding-bottom: 6px;
}

/* WORDMARK */
.wordmark {
	max-width: 11em;
	margin: 0 auto;
	padding: 28px 0 16px;
	transform: rotate(-3deg);
	opacity: 0.95;
}

.wordmark a {
	display: block;
	border: none;
	color: inherit;
}

/* NAV CONTAINER */
.nav {
	display: flex;
	justify-content: center;
	gap: 8px;
	padding: 0 16px 14px;
	flex-wrap: wrap;
}

/* BUTTON BASE */
.nav button {
	background: rgba(255, 255, 255, 0.03);
	border: 1px solid rgba(255, 255, 255, 0.12);
	color: rgba(255, 255, 255, 0.75);

	font-size: 12px;
	letter-spacing: 0.02em;
	text-transform: uppercase;

	padding: 6px 12px;
	border-radius: 999px;

	cursor: pointer;

	transition:
		background 0.2s ease,
		border-color 0.2s ease,
		transform 0.2s ease,
		color 0.2s ease;
}

/* HOVER */
.nav button:hover {
	background: rgba(255, 255, 255, 0.06);
	border-color: rgba(255, 255, 255, 0.25);
	color: white;
	transform: translateY(-1px);
}

/* ACTIVE STATE */
.nav button.selected {
	background: rgba(255, 255, 255, 0.10);
	border-color: rgba(252, 253, 79, 0.55);
	color: #fcfd4f;

	box-shadow:
		0 0 0 1px rgba(252, 253, 79, 0.15),
		0 6px 18px rgba(0, 0, 0, 0.35);
}

/* MOBILE */
@media (max-width: 900px) {
	.nav {
		gap: 6px;
	}

	.nav button {
		font-size: 11px;
		padding: 5px 10px;
	}
}

</style>