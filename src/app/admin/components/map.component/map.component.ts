import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as Leaflet from 'leaflet';

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
    selector: 'app-map',
    standalone: true,
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {
    @Input() latitude: number = INITIAL_LATITUDE;
    @Input() longitude: number = INITIAL_LONGITUDE;
    @Input() city: string = '';
    @Input() connectedTo: { latitude: number; longitude: number; city: string }[] = [];

    private map!: Leaflet.Map;
    private mainMarker?: Leaflet.Marker;
    private markers?: Leaflet.Marker[];

    ngOnInit(): void {
        console.log('map_ngOnInit');
        this.initMap();
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('map_ngOnChanges');
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
        this.mainMarker = Leaflet.marker([this.latitude, this.longitude], { icon: blueIcon }).addTo(this.map);
        this.mainMarker.bindPopup(this.city).openPopup();
    }

    private addConnectedMarkers(): void {
        if (!this.map) return;

        if (this.markers) {
            this.markers.forEach((marker) => this.map.removeLayer(marker));
        }

        this.markers = [];
        const grayIcon = this.createIcon(CONNECTED_MARKER_COLOR);
        this.connectedTo?.forEach((location) => {
            if (
                location &&
                typeof location === 'object' &&
                typeof location?.latitude === 'number' &&
                typeof location?.longitude === 'number'
            ) {
                const marker = Leaflet.marker([location?.latitude, location?.longitude], { icon: grayIcon }).addTo(
                    this.map
                );
                marker.bindPopup(location.city).openPopup();
                this.markers?.push(marker);
            }
        });
    }
}
