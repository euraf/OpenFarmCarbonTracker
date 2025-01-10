import { v4 as uuidv4 } from "uuid";
import type { Component } from "solid-js";
import { action } from "@solidjs/router";
import { useParams } from "@solidjs/router";
import type MapboxDraw from "@mapbox/mapbox-gl-draw";
import { createEffect, createSignal, on, onMount } from "solid-js";

import * as togeojson from "@tmcw/togeojson";

// @ts-ignore
import * as turf from "@turf/turf";
// @ts-ignore
import { centroid, featureCollection } from "@turf/turf";

import {
	type Feature,
	type FeatureCollection,
	type GeoJsonProperties,
	type Polygon,
} from "geojson";

import {
	updateArea,
	useDrawControl,
} from "~/util/map_controls/useDrawControl.ts";
import type { IControl } from "maplibre-gl";
import { modes } from "~/routes/land-use";
import { removeLayers } from "~/util/removeLayers.ts";
import { Field, setStore } from "~/store/store";
import { Button } from "~/components/ui/button";
import { CountryCode } from "~/util/countries";

export const EditFieldMode: Component<{
	setMode: any;
	getMap: () => maplibregl.Map;
	store: { fields: Field[]; country: CountryCode };
	field: Field;
}> = ({ getMap, setMode, store, field }) => {
	let draw: MapboxDraw;


	const [fieldName, setFieldName] = createSignal<string>(
		field?.name ? field.name : "",
	);
	// const [fieldGeometry, setFieldGeometry] = createSignal<Polygon>();
	// const [fieldArea, setfieldArea] = createSignal<number>();

	const [kmlFile, setInternalKMLFile] = createSignal<File | null>(null);
	const [polygon, setPolygon] = createSignal<
		Feature<
			Polygon,
			GeoJsonProperties
		> | null
	>(null);

	function addDrawControl() {
		draw = useDrawControl(getMap());
	}

	function removeFields() {
		removeLayers(["field-fills", "field-outlines", "field-labels"], getMap());
		// getMap().off("click", "field-labels", moveMapToField);
	}

	function removeDrawControl() {
		if (draw) {
			if (getMap().hasControl(draw as unknown as IControl)) {
				getMap().removeControl(draw as unknown as IControl);
			}

			draw = undefined;
		}
	}

	const [submitDisabled, setSubmitDisabled] = createSignal<boolean>(false);
	const params = useParams<{ parcelId: string }>();

	const addFieldFormAction = action(async (formData: FormData) => {
		setSubmitDisabled(true);
		
		if (
			!formData.get("geometry")?.toString() ||
			!formData.get("area")?.toString() || !fieldName()
		) {
			setSubmitDisabled(false);
			return;
		}

		const payload = {
			name: fieldName(),
			geometry: JSON.parse(formData.get("geometry")?.toString()),
			area: Number.parseFloat(formData.get("area")?.toString()),
		};

		if (payload.geometry && payload.area && payload.name) {
			if (field?.uuid) {
				setStore(
					"fields",
					(prevFields) =>
						prevFields.map((thisfield) =>
							thisfield.uuid === field.uuid
								? {
									...field,
									name: payload.name,
									geometry: payload.geometry,
									area: payload.area,
								}
								: thisfield
						),
				);
			} else {
				setStore("fields", (prevFields) => [
					...prevFields,
					{
						uuid: uuidv4(),
						name: payload.name,
						geometry: payload.geometry,
						area: payload.area,
						rotations: store.country === 'DK' && polygon()?.properties?.Afgkode ? [{
							splitTreePercent: 0,
							cropSegments: [{
								LPIS_ID: polygon()?.properties?.Afgkode,
							  years: 10,
							}],
							treeSegments: []
						}] : [],
						repeatLastRotation: false,
					},
				]);
			}
			removeFields();
			removeDrawControl();
			setMode(modes.default);
		} else {
			setSubmitDisabled(false);
		}
	});

	function drawFields() {
		const fieldsGeo = featureCollection(
			store?.fields.map((field) => {
				return field.geometry;
			}),
		);

		const fieldsLabels = featureCollection(
			store?.fields.map((field) => {
				return {
					...centroid(field.geometry),
					properties: {
						description: field.name,
					},
				};
			}),
		);

		cleanupLayers();
		getMap().addLayer({
			id: "field-fills",
			type: "fill",
			//@ts-ignore
			source: {
				type: "geojson",
				data: fieldsGeo,
			},
			layout: {},
			paint: {
				"fill-color": "rgba(127,34,192,0.6)",
			},
		});

		getMap().addLayer({
			id: "field-outlines",
			type: "line",
			//@ts-ignore
			source: {
				type: "geojson",
				data: fieldsGeo,
			},
			layout: {},
			paint: {
				"line-color": "rgba(255,255,255,0.5)",
				"line-width": 1,
			},
		});

		getMap().addLayer({
			id: "field-labels",
			type: "symbol",
			//@ts-ignore
			source: {
				type: "geojson",
				data: fieldsLabels,
			},
			layout: {
				"text-field": ["get", "description"],
				"text-justify": "center",
				"icon-image": ["concat", ["get", "icon"], "-15"],
				"text-size": 12,
			},
			paint: {
				"text-color": "white",
				"text-halo-color": "black",
				"text-halo-width": 1,
			},
		});
	}

	onMount(() => {
		drawFields();
		setFieldName(field?.name ? field.name : "");

		addDrawControl();
		loadDrawCoordinates();
	});

	function cancel() {
		cleanupLayers();
		setMode(modes.default);
	}

	function cleanupLayers() {
		removeDrawControl();
		removeFields();
		removeLPISFields();
	}

	function loadDrawCoordinates() {
		if (draw && field?.geometry) {
			const geometry = field.geometry;
			
			const featureIds: string[] = draw.add(geometry);

			if (featureIds.length === 0) return;

			if (geometry.type === "Polygon") {
				getMap().jumpTo({
					center: geometry.coordinates[0][0] as [number, number],
					zoom: 15,
				});
			}

			draw.changeMode("simple_select", { featureIds: featureIds });

			updateArea(draw.get(featureIds[0]));
		}
	}

	function drawKMLorLPIS() {
		if (draw && polygon()?.geometry) {
			if (draw.getAll().features.length > 0) {
				draw.deleteAll();
			}

			const geometry = polygon()!.geometry;

			
			const featureIds: string[] = draw.add(geometry);

			if (featureIds.length === 0) return;

			if (geometry.type === "Polygon") {
				getMap().flyTo({
					center: geometry.coordinates[0][0] as [number, number],
					zoom: 15,
				});
			}

			draw.changeMode("simple_select", { featureIds: featureIds });

			updateArea(draw.get(featureIds[0]));
		}
	}

	async function parseKMLFile(e: Event) {
		function invalidFile() {
			alert("Can't parse field coordinates.");
		}

		// @ts-ignore
		const file = e.target.files![0];

		// Parse KML file
		if (file) {
			const kmlContent = await file?.text();
			if (!kmlContent) {
				invalidFile();
				return;
			}
			const kml = new DOMParser().parseFromString(kmlContent, "text/xml");
			if (!kml) {
				invalidFile();
				return;
			}
			const converted = togeojson.kml(kml);
			if (!converted) {
				invalidFile();
				return;
			}

			if (!converted!.features[0]) {
				invalidFile();
				return;
			}

			let geometry = converted!.features[0]!.geometry!;
			if (!geometry) {
				invalidFile();
				return;
			}

			if (geometry.type === "LineString") {
				// Create a polygon from the linestring
				geometry = turf.polygon([geometry.coordinates]).geometry;
			}

			if (geometry.type === "Polygon") {
				geometry.coordinates[0] = geometry!.coordinates[0].map((coordinate) => [
					coordinate[0],
					coordinate[1],
				]);

				const turfPolygon = turf.polygon(
					(geometry as Polygon).coordinates,
				);

				setPolygon((prev) => turfPolygon);
				setInternalKMLFile((prev) => file);
			} else {
				invalidFile();
				return;
			}

			drawKMLorLPIS();
		} else {
			invalidFile();
		}
	}

	const [showLPISFields, setShowLPISFields] = createSignal(false);
	createEffect(
		on([showLPISFields], () => {
			if (showLPISFields()) {
				addLPISFields(getMap());
			} else {
				removeLPISFields();
			}
		}),
	);

	// ---------- LPIS START

	const [clickedFeature, setClickedFeature] = createSignal<string>("");

	function removeLPISFields() {
		let tilesets = [
			"AT_INSPIRE_FELDSTUECKE_2019_POLYGON",
			"DK_Marker_2023",
			"FI_AgriculturalParcel_2023",
			"FR_PARCELLES_GRAPHIQUES_2022",
			"NL_brpgewaspercelen_definitief_2022",
		].filter((tileset) => tileset.startsWith(store.country));

		for (const tileset of tilesets) {
			if (getMap().getLayer(`${tileset}_fieldfill`)) {
				getMap().removeLayer(`${tileset}_fieldfill`);
			}

			if (getMap().getLayer(`${tileset}_fieldline`)) {
				getMap().removeLayer(`${tileset}_fieldline`);
			}

			if (getMap().getSource(`${tileset}_source`)) {
				getMap().removeSource(`${tileset}_source`);
			}

			getMap().off("mousemove", `${tileset}_fieldfill`, LPISFIeldMouseMove);
			getMap().off("mouseleave", `${tileset}_fieldfill`, LPISFieldMouseLeave);
		}
	}

	// Create a popup, but don't add it to the map yet.
	// const popup = new maplibregl.Popup({
	// 	closeButton: false,
	// 	closeOnClick: false,
	// });

	function LPISFieldMouseLeave() {
		getMap().getCanvas().style.cursor = "";
		// popup.remove();
	}

	function LPISFIeldMouseMove(e) {
		// if (e.features && e.features.length > 0 && e.features[0].id !== undefined) {
		// 	console.log('id:', e.features[0].id);
		// } else {
		// 	console.log('Feature ID is undefined', e);
		// }

		// // Change the fill color of the polygon on hover
		// const tileset = e.features[0].layer.id.split('_').slice(0, -1).join('_');
		// getMap().setPaintProperty(`${tileset}_fieldfill`, 'fill-color', [
		// 	'case',
		// 	['==', ['id'], e.features[0].id],
		// 	'rgba(0, 255, 0, 0.7)', // Change to green on hover
		// 	'rgba(255, 248, 97, 0.7)' // Default color
		// ]);

		// Change the cursor style as a UI indicator.
		getMap().getCanvas().style.cursor = "pointer";

		var coordinates = e.lngLat;

		let tooltipHTML = "";
		for (const [key, value] of Object.entries(e.features[0].properties)) {
			tooltipHTML += `${key}: ${value}<br/>`;
		}

		// Ensure that if the map is zoomed out such that multiple
		// copies of the feature are visible, the popup appears
		// over the copy being pointed to.
		while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
			coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
		}

		// Populate the popup and set its coordinates
		// based on the feature found.
		// popup.setLngLat(coordinates).setHTML(tooltipHTML).addTo(getMap());
	}

	function addLPISFields(map: maplibregl.Map) {
		let tilesets = [
			"AT_INSPIRE_FELDSTUECKE_2019_POLYGON",
			"DK_Marker_2023",
			"FI_AgriculturalParcel_2023",
			"FR_PARCELLES_GRAPHIQUES_2022",
			"NL_brpgewaspercelen_definitief_2022",
		].filter((tileset) => tileset.startsWith(store.country));

		let hoveredStateIds: string[] = [];

		for (const tileset of tilesets) {
			getMap().addSource(`${tileset}_source`, {
				type: "vector",
				url: `https://martin-lpis.onrender.com/${tileset}`,
				// url: `http://localhost:3000/${tileset}`,
				promoteId: { fields: "AutoID" },
			});

			getMap().addLayer({
				id: `${tileset}_fieldfill`,
				type: "fill",
				source: `${tileset}_source`,
				"source-layer": "fields",
				paint: {
					"fill-color": [
						"case",
						["boolean", ["feature-state", "hover"], false],
						"rgba(0, 255, 0, 0.7)", // Change to green on hover
						"rgba(255, 248, 97, 0.7)", // Default color
					],
				},
			});

			getMap().addLayer({
				id: `${tileset}_fieldline`,
				type: "line",
				source: `${tileset}_source`,
				"source-layer": "fields",
				paint: {
					"line-color": "black",
					"line-width": 1,
				},
			});

			function clear() {
				if (showLPISFields()) {
					for (const id of hoveredStateIds) {
						getMap().setFeatureState(
							{
								source: `${tileset}_source`,
								id: id,
								sourceLayer: "fields",
							},
							{ hover: false },
						);
					}
					hoveredStateIds = [];
				}
			}

			getMap().on("mousemove", `${tileset}_fieldfill`, (e) => {
				clear();

				if (e.features && e.features.length > 0) {
					const featureId = e.features[0].properties.AutoID; // Use a different property as ID
					if (!hoveredStateIds.includes(featureId)) {
						hoveredStateIds.push(featureId);
					}

					if (featureId) {
						getMap().setFeatureState(
							{
								source: `${tileset}_source`,
								id: featureId,
								sourceLayer: "fields",
							},
							{ hover: true },
						);
					}
				} else {
					//console.log("No features found");
				}
			});

			// When the mouse leaves the fieldfill layer, update the feature state of the
			// previously hovered features.
			getMap().on("mouseleave", `${tileset}_fieldfill`, () => {
				clear();
			});

			getMap().on("mousemove", `${tileset}_fieldfill`, LPISFIeldMouseMove);

			getMap().on("mouseleave", `${tileset}_fieldfill`, LPISFieldMouseLeave);

			getMap().on("click", `${tileset}_fieldfill`, (e) => {
				if (e.features && e.features.length > 0) {
					setClickedFeature(e.features[0].properties.AutoID);

					// setPolygon(e.features[0]);
					// drawKML();
					// setShowLPISFields(false);
					// return;

					//console.log("ID:", clickedFeature());

					const features = getMap()
						.querySourceFeatures(`${tileset}_source`, {
							sourceLayer: "fields",
						})
						.filter((f) => f.properties.AutoID === clickedFeature());

					//console.log("FEATS", features);

					if (features.length > 0) {
						if (features.length > 1) {
							const featureCollection: FeatureCollection = {
								type: "FeatureCollection",
								features: features.map((f) => ({
									type: "Feature",
									geometry: f.geometry,
									properties: f.properties,
								})),
							};
							const combinedGeometry = turf.union(featureCollection);
							if (combinedGeometry) {
								setPolygon({
									type: "Feature",
									geometry: combinedGeometry.geometry,
									properties: {},
								});
							}
						} else {
							setPolygon(features[0]);
						}
						const fieldNameDefaults = {
							"FR": "id_parcel",
							"DK": "Marknr",
							"FI": "TUNNUS",
							"AT": "FS_KENNUNG",
							"NL": "id",
						};

						const fieldNameKey = fieldNameDefaults[store.country];
						const fieldName = features[0].properties[fieldNameKey];

						setFieldName(`${fieldNameKey}: ${fieldName}`);

						drawKMLorLPIS();
						setShowLPISFields(false);
					}
				}

				// Add a white border to the clicked polygon
			});
		}
	}

	// ---------- LPIS END

	return (
		<>
			<div>
				<form method="post" action={addFieldFormAction}>
					<div
						class="bg-slate-700"
						style={{
							"border-radius": "10px",
							position: "fixed",
							"z-index": 10,

							right: "20px",
							bottom: "20px",
							padding: "10px",
						}}
					>
						<div class="mb-2">
							<span class="w-full block  text-white">
								Select field from gov. data
							</span>

							{/* {getMongoDBUser().countryCode === "DK" ? ( */}
							<Button
								type="button"
								class="rounded-sm p-1 mt-2 btn-default w-full"
								onClick={(e) => setShowLPISFields(!showLPISFields())}
							>
								{showLPISFields() ? "Hide LPIS fields" : "Show LPIS fields"}
							</Button>
							{
								/* ) : (
								<></>
							)} */
							}
						</div>
						{
							/* <div class="mb-2">
							<span class="w-full block  text-white mb-2">Upload geometry</span>

							<Button>
								<label
									for="kmlfile"
									class="rounded-sm p-1 my-2 btn-default  text-white"
								>
									{kmlFile()?.name
										? `${kmlFile()?.name} (${
											polygon()?.geometry?.coordinates[0].length
										} coordinates)`
										: "Use geometry from KML file"}
								</label>
							</Button>
							<input
								style="visibility:hidden;display:none;"
								type="file"
								onChange={parseKMLFile}
								name="kmlfile"
								id="kmlfile"
								title="KML File"
							/>
						</div> */
						}

						<div class="mb-4">
							<label for="fieldName" class="block  text-white ">
								Field Name
							</label>
							<input
								type="text"
								id="fieldName"
								name="fieldName"
								value={fieldName()}
								onChange={(e) => setFieldName(e.target.value)}
								class="mt-1 block w-full rounded-md p-2 border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								placeholder="Enter field name"
							/>
						</div>

						<div>
							<Button
								type="button"
								class="rounded-sm p-1 my-2 btn-default center-block"
								onClick={cancel}
							>
								Cancel
							</Button>

							<Button
								type="submit"
								disabled={submitDisabled()}
								class="rounded-sm p-1 my-2 ml-2 btn-default center-block"
							>
								Save
							</Button>
						</div>
					</div>
					<div>
						<input type="hidden" id="name" name="layer[name]" />
						<input type="hidden" id="geometry" name="geometry" />
						<input type="hidden" id="area" name="area" />
					</div>
				</form>
			</div>

			{/* <Show when={fieldName() !== ""}> */}
			{/* <h1 class="h1 addFieldModeDescription"> */}
			<span
				class="bg-customdark1"
				style={{
					"border-radius": "10px",
					position: "fixed",
					"z-index": 10,
					color: "white",
					top: "200px",
					"font-size": "13px",
					// "text-align": "center",
					left: "50%",
					transform: "translateX(-50%)",
					padding: "10px",
				}}
			>
				Click on the map to start drawing a field
				<br />
				Click on a field once to select the whole unit
				<br />
				Click on the field/edges/corners again for detailed selection
				<br />
				Press backspace to delete the current selection
			</span>
			{/* </Show> */}
		</>
	);
};
