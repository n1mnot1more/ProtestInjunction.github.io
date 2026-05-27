<script>
	import Map from "../components/Map.svelte";

	const sections = [
		{
			id: "map",
			title: "Map",
			text: "Overview of injunction coverage across wards and LADs."
		},
		{
			id: "stories",
			title: "Stories",
			text: "Individual accounts and impacts of injunctions."
		},
		{
			id: "resources",
			title: "Resources",
			text: "Further reading, datasets, and methodology."
		},
		{
			id: "acknowledgements",
			title: "Acknowledgements",
			text: "Credits, collaborators, and data sources."
		}
	];
</script>

<div class="page">

	<!-- LEFT MAP -->
	<div class="map-column">

		<!-- LEGEND BAR -->
		<div class="legend-bar">

			<div class="legend">

				<div class="legend-title">
					Hectares injuncted
				</div>

				<div class="legend-scale">

					<div class="legend-item">
						<div class="legend-dot" style="background:#61187a;"></div>
						<span>0-5</span>
					</div>

					<div class="legend-item">
						<div class="legend-dot" style="background:#b0349a;"></div>
						<span>20</span>
					</div>

					<div class="legend-item">
						<div class="legend-dot" style="background:#e04d79;"></div>
						<span>100</span>
					</div>

					<div class="legend-item">
						<div class="legend-dot" style="background:#fd842b;"></div>
						<span>300</span>
					</div>

					<div class="legend-item">
						<div class="legend-dot" style="background:#fec083;"></div>
						<span>500</span>
					</div>

					<div class="legend-item">
						<div class="legend-dot" style="background:#fcfd4f;"></div>
						<span>500-1300</span>
					</div>

				</div>

			</div>

		</div>

		<!-- MAP -->
		<div class="map-sticky">
			<Map />
		</div>

	</div>

	<!-- RIGHT TEXT -->
	<div class="text-column">

		{#each sections as section}
			<section class="step" id={section.id}>
				<h2>{section.title}</h2>
				<p>{section.text}</p>
			</section>
		{/each}

	</div>

</div>

<style>

.page {
	display: flex;
	min-height: 100vh;
	background: #0a061b;
	color: white;
}

/* LEFT SIDE */
.map-column {
	width: 60vw;
	display: flex;
	flex-direction: column;
	background: #0a061b;
	position: relative;
}

/* LEGEND BAR */
.legend-bar {
	height: 72px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding: 0 1.5rem;
	position: sticky;
	top: 0;
	z-index: 30;
	background: #0a061b;
}

/* MAP AREA */
.map-sticky {
	position: sticky;
	top: 72px;
	height: calc(100vh - 72px);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background: #0a061b;
}

/* LEGEND */
.legend {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 0.45rem;
	color: white;
	font-size: 0.72rem;
	line-height: 1;
	text-shadow: 0 1px 3px rgba(0,0,0,0.85),
	             0 0 8px rgba(0,0,0,0.6);
}

.legend-title {
	font-weight: 600;
	letter-spacing: 0.02em;
}

.legend-scale {
	display: flex;
	align-items: center;
	gap: 0.7rem;
}

.legend-item {
	display: flex;
	align-items: center;
	gap: 0.28rem;
}

.legend-dot {
	width: 9px;
	height: 9px;
	border-radius: 50%;
	flex-shrink: 0;
}

/* RIGHT TEXT */
.text-column {
	width: 40vw;
	padding: 0 3rem;
	position: relative;
	z-index: 2;
}

.step {
	min-height: 85vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	max-width: 40rem;
	margin: 20vh 0;
}

h2 {
	font-size: 2rem;
	margin-bottom: 1rem;
}

p {
	font-size: 1.1rem;
	line-height: 1.7;
	color: #d0d0d0;
}

/* MOBILE */
@media (max-width: 900px) {

	.page {
		display: block;
		position: relative;
	}

	.map-column {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 0;
		pointer-events: none;
	}

	.legend-bar {
		height: auto;
		padding: 1rem;
		justify-content: flex-end;
	}

	.legend {
		font-size: 0.62rem;
	}

	.legend-scale {
		gap: 0.45rem;
		flex-wrap: wrap;
		justify-content: flex-end;
		max-width: 220px;
	}

	.legend-dot {
		width: 8px;
		height: 8px;
	}

	.map-sticky {
		position: absolute;
		inset: 0;
		height: 100%;
	}

	.text-column {
		width: 100%;
		padding: 0 1.25rem;
	}

	.step {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 35vh 0;
	}

	.step > * {
		background: rgba(10, 10, 10, 0.82);
		backdrop-filter: blur(6px);
		padding: 1.5rem;
		border-radius: 12px;
	}

	h2 {
		font-size: 1.6rem;
	}

	p {
		font-size: 1rem;
		line-height: 1.6;
	}
}

</style>