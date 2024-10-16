import type { IControl } from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
// @ts-ignore
import geojsonArea from "@mapbox/geojson-area";

export function useDrawControl(map: maplibregl.Map) {
	const Draw = new MapboxDraw({
		controls: {
			point: false,
			line_string: false,
			polygon: false,
			trash: false,
			combine_features: false,
			uncombine_features: false,
		},
		displayControlsDefault: false,
		defaultMode: "draw_polygon",
	});

	document.addEventListener("keyup", (event) => {

		const target = event.target as HTMLElement;
		if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
			return; // Skip if the event target is an input or textarea
		}
		
		if ((event.key === "Delete" || event.key === "Backspace") && Draw) {
			try {
				//@ts-ignore
				const selectedFeatures = Draw.getSelectedIds();

				console.log("HERE", selectedFeatures?.length, selectedFeatures)
				if (selectedFeatures?.length > 0) {
					//@ts-ignore
					Draw.trash();
					//@ts-ignore
					if (Draw.getMode() === "simple_select") {
						//@ts-ignore
						Draw.changeMode("draw_polygon");
					}
				}
			} catch (error) {
				console.error("Error accessing selected features:", error);
			}
		} else {
			"Oh..."
		}
	});

	map.addControl(Draw as unknown as IControl, "top-right");
	const mapboxglControlGroup = document.getElementsByClassName(
		"mapboxgl-ctrl-group",
	);

	for (let i = 0; i < mapboxglControlGroup.length; i++) {
		const element = mapboxglControlGroup[i];
		element.className = "maplibregl-ctrl maplibregl-ctrl-group";
	}
	map.on("draw.create", updateAreaEvent);
	map.on("draw.delete", updateAreaEvent);
	map.on("draw.update", updateAreaEvent);
	return Draw;
}

function updateAreaEvent(e: any) {
	updateArea(e.features[0]);
}

export function updateArea(shape: any) {
	console.log("UpdateArea");
	const shape_for_db = JSON.stringify(shape);
	console.log("ML shape", shape);

	const shapeArea = geojsonArea.geometry(shape.geometry);
	console.log("ML area", shapeArea);

	// // document.getElementById("coordinates").innerHTML = "A layer geometry has successfully been created and you may click the button below to create the new layer";
	// @ts-ignore
	document.getElementById("geometry").value = shape_for_db;

	// // Send area to document input
	// @ts-ignore
	document.getElementById("area").value = shapeArea;
}
