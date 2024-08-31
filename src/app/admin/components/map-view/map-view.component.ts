import { Component, inject, Input, OnChanges, OnDestroy, OnInit, Signal, SimpleChanges } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import * as Leaflet from 'leaflet';

import { Station } from '../../../core/models/station/station.model';
import { selectStations } from '../../../redux/selectors/app-stations.selector';

const ICON_SIZE: [number, number] = [30, 30];
const ICON_ANCHOR: [number, number] = [12, 24];
const POPUP_ANCHOR: [number, number] = [0, -24];
const MAIN_MARKER_COLOR = 'assets/images/map/map-marker-blue.png';
const CONNECTED_MARKER_COLOR = 'assets/images/map/map-marker-grey.png';
const TILE_LAYER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const INITIAL_ZOOM_LEVEL = 13;
const MAX_ZOOM_LEVEL = 19;
const MAP_ATTRIBUTION = 'Train Map';
const INITIAL_LATITUDE = 51.505;
const INITIAL_LONGITUDE = -0.09;

@Component({
    selector: 'app-map-view',
    standalone: true,
    templateUrl: './map-view.component.html',
    styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit, OnChanges, OnDestroy {
    private store = inject(Store);
    public allStations!: Signal<Station[]>;
    @Input() latitude: number = INITIAL_LATITUDE;
    @Input() longitude: number = INITIAL_LONGITUDE;
    @Input() city: string = '';
    @Input() connectedTo: { latitude: number; longitude: number; city: string; id: number }[] = [];

    @Input() draggable!: boolean;

    private map!: Leaflet.Map;
    private mainMarker?: Leaflet.Marker;
    private markers?: Leaflet.Marker[];

    constructor() {
        const allStations$ = this.store.select(selectStations);
        this.allStations = toSignal(allStations$, { initialValue: [] });
    }

    ngOnInit(): void {
        this.initMap();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['latitude'] || changes['longitude'] || changes['city'] || changes['connectedTo']) {
            this.updateMap();
        }
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
        }
    }

    private initMap(): void {
        this.map = Leaflet.map('map').setView([this.latitude, this.longitude], INITIAL_ZOOM_LEVEL);

        Leaflet.tileLayer(TILE_LAYER_URL, {
            maxZoom: MAX_ZOOM_LEVEL,
            attribution: MAP_ATTRIBUTION,
        }).addTo(this.map);

        this.addMainMarker();
        this.addConnectedMarkers();
    }

    private updateMap(): void {
        if (this.map) {
            this.map.setView([this.latitude, this.longitude], INITIAL_ZOOM_LEVEL);
            this.addConnectedMarkers();
            this.addMainMarker();
        }
    }

    private createIcon(iconUrl: string): Leaflet.Icon {
        return Leaflet.icon({
            iconUrl,
            iconSize: ICON_SIZE,
            iconAnchor: ICON_ANCHOR,
            popupAnchor: POPUP_ANCHOR,
        });
    }

    private addMainMarker(): void {
        if (!this.map) return;

        if (this.mainMarker) {
            this.map.removeLayer(this.mainMarker);
        }

        const blueIcon = this.createIcon(MAIN_MARKER_COLOR);
        this.mainMarker = Leaflet.marker([this.latitude, this.longitude], {
            icon: blueIcon,
            draggable: this.draggable,
        }).addTo(this.map);

        this.mainMarker.bindPopup(this.city, { closeButton: true }).openPopup();

        this.map.setView([this.latitude, this.longitude], INITIAL_ZOOM_LEVEL);

        this.mainMarker.on('dragend', (event) => {
            const marker = event.target;
            const position = marker.getLatLng();
            this.latitude = position.lat;
            this.longitude = position.lng;

            this.onMarkerDragEnd();
        });
    }

    onMarkerDragEnd() {
        const event = new CustomEvent('markerDragged', {
            detail: { latitude: this.latitude, longitude: this.longitude },
        });
        window.dispatchEvent(event);
    }

    private addConnectedMarkers(): void {
        if (!this.map) return;

        if (this.markers) {
            this.markers.forEach((marker) => this.map.removeLayer(marker));
        }

        this.markers = [];
        const grayIcon = this.createIcon(CONNECTED_MARKER_COLOR);

        if (this.connectedTo.length > 0) {
            const relations = this.connectedTo
                .map((connection) => {
                    const matchingStation = this.allStations().find((station) => station.city === connection.city);
                    return matchingStation
                        ? {
                              latitude: matchingStation.latitude,
                              longitude: matchingStation.longitude,
                              city: matchingStation.city,
                              id: matchingStation.id,
                          }
                        : null;
                })
                .filter(
                    (relation): relation is { latitude: number; longitude: number; city: string; id: number } =>
                        relation !== null
                );

            relations.forEach((location) => {
                if (
                    location &&
                    typeof location === 'object' &&
                    typeof location.latitude === 'number' &&
                    typeof location.longitude === 'number'
                ) {
                    const marker = Leaflet.marker([location.latitude, location.longitude], { icon: grayIcon }).addTo(
                        this.map
                    );

                    marker
                        .bindTooltip(location.city, {
                            permanent: true,
                            direction: 'bottom',
                        })
                        .openTooltip();

                    this.markers?.push(marker);
                }
            });
        }
    }
}
