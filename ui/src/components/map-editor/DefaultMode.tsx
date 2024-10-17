import { A, action, useNavigate, useParams } from "@solidjs/router";
import type { Map as MLMap } from "maplibre-gl";
import { createSignal, For, onMount, type Resource } from "solid-js";
import { removeLayers } from "~/util/removeLayers.ts";
import { featureCollection } from "@turf/helpers";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "../ui/button";
import { setStore } from "~/store/store";
import { centroid } from "@turf/turf";

type DefaultModeProps = {
	store: any;
	setMode: any;
	addField: any;
	editField: any;
	getMap: () => MLMap;
};

function DefaultMode({
	addField,
	editField,
	store,
	setMode,
	getMap,
}: DefaultModeProps) {
	function cleanupLayers() {
		removeLayers(["field-fills", "field-outlines", "field-labels"], getMap());
		getMap().off("click", "field-labels", moveMapToField);
	}

	const [fieldBeingDeleted, setFieldBeingDeleted] = createSignal<string | undefined>(
		undefined,
	);

	function drawFields() {
		cleanupLayers();

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

		getMap().on("click", "field-labels", moveMapToField);

	}
	function moveMapToField(e: any) {
		e.clickOnLabel = true;
		getMap().flyTo({
			speed: 2,
			center: e.features[0].geometry.coordinates,
			zoom: 15,
		});
	}

	onMount(() => {
		if (getMap().isStyleLoaded()) {
			drawFields();
		} else {
			getMap().on("load", () => {
				drawFields();
			});
		}
	});

	const deleteForm = action(async (formData: FormData) => {
		if (fieldBeingDeleted()) {
			setStore(
				"fields",
				(fields) =>
					fields.filter((field) => field.uuid !== fieldBeingDeleted()),
			);
		}
		setFieldBeingDeleted(undefined);
		drawFields();
	});

	const [deleteFieldModalOpen, setDeleteFieldModalOpen] = createSignal(false);

	
	const navigate = useNavigate()

	return (
		<>
			<Dialog
				open={deleteFieldModalOpen()}
				onOpenChange={setDeleteFieldModalOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle id="deleteFieldModalLabel">
							Delete field
						</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<p>
							Permanently delete the field and any rotations
							configured on it.
						</p>
					</DialogDescription>
					<DialogFooter>
						<form action={deleteForm} method="post" class="delete-form">
							<Button
								type="submit"
								class="rounded-sm p-1 my-1 btn-danger"
								onClick={() => setDeleteFieldModalOpen(false)}
							>
								Delete field
							</Button>
						</form>
						<Button
							class="rounded-sm p-1 my-1 ml-2 btn-default"
							onClick={() => setDeleteFieldModalOpen(false)}
						>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<div
				class="bg-slate-700"
				style={{
					"border-radius": "10px",
					position: "fixed",
					"z-index": 10,

					right: "10px",
					bottom: "10px",
					padding: "10px",
				}}
			>
				<strong class="text-white">
					<span>Fields</span>
				</strong>
				<div
					class="list-group rounded-md"
					style={{
						"max-height": "500px",
						"overflow-y": "auto",
					}}
				>
					<For each={store?.fields}>
						{(field) => (
							<div class="list-group-item list-group-item-action list-group-item-primary overlay-list-div">
								<A
									class="overlay-list-link  pr-4"
									href={`/fields/${field.uuid}`}
								>
									{field.name}
								</A>
								<div>
									<Button
										title="Configure field"
										class={"rounded-sm p-1 my-2 btn-default menu-btn list-group-button rounded-sm"}
										onClick={() => {
											navigate(`/fields/${field.uuid}`)
										}}
									>
										<i class="fa-solid fa-gear" />
									</Button>
									<Button
										title="Edit field geometry"
										class={"rounded-sm p-1 my-2 btn-default menu-btn list-group-button rounded-sm"}
										onClick={() => {
											cleanupLayers();

											getMap().flyTo({
												speed: 2,
												center: field.geometry.geometry
													.coordinates[0][0],
												zoom: 15,
											});

											editField(field);
										}}
									>
										<i class="fa-solid fa-pen" />
									</Button>

									<Button
										title="Show field on map"
										type="button"
										class={"rounded-sm p-1 my-2 btn-default menu-btn list-group-button rounded-sm"}
										onClick={() => {
											

											// Go to location of layer
											getMap().flyTo({
												speed: 2,
												center: field.geometry.geometry
													.coordinates[0][0],
												zoom: 15,
											});

											// setCoordinates([Number(parcel.lng), Number(parcel.lat)]);
										}}
									>
										<i class="fa-solid fa-crosshairs" />
									</Button>
									<Button
										title="Delete field"
										type="button"
										variant={"destructive"}
										class={"rounded-sm p-1 my-1 btn-danger menu-btn list-group-button rounded-sm"}
										onclick={() => {
											setDeleteFieldModalOpen(true);
											setFieldBeingDeleted(field.uuid);
										}}
									>
										<i class="fa-solid fa-trash" />
									</Button>
								</div>
							</div>
						)}
					</For>
				</div>

				<Button
					type="button"
					class="rounded-sm p-1 mt-2 btn-default w-full"
					onClick={() => addField()}
				>
					Add new field
				</Button>
			</div>
		</>
	);
}

export default DefaultMode;
