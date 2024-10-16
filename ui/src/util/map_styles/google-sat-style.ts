import type { StyleSpecification } from "maplibre-gl";

export const GoogleSatStyle: StyleSpecification = {
	glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
	version: 8,
	sources: {
		"raster-tiles": {
			type: "raster",
			tiles: [
				"https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
				"https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
				"https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
				"https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
			],
			tileSize: 256,
		},
	},
	layers: [
		{
			id: "simple-tiles",
			type: "raster",
			source: "raster-tiles",
			minzoom: 0,
			maxzoom: 21,
		},
	],
};
