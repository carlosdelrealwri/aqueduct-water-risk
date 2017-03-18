import L from 'leaflet/dist/leaflet';
import React from 'react';
import { Sidebar, SegmentedUi } from 'aqueduct-components';
import Map from 'components/map/Map';
import { tabOptions } from 'constants/mapView';
import { layers } from 'constants/layers';
import MapView from './_MapView';
import AnalyseLocations from './_AnalyseLocations';
import ZoomControl from 'components/zoom/ZoomControl';
import BtnMenu from 'components/ui/BtnMenu';

export default class MapPage extends React.Component {

  componentWillMount() {
    this.props.updateUrl();
  }

  render() {
    /* Map config */
    const updateMap = (map) => {
      this.props.setMapParams({
        zoom: map.getZoom(),
        latLng: map.getCenter()
      });
    };

    const addPoint = (map, opts) => {
      this.props.addPoint(opts.latlng);
    };

    const listeners = {
      moveend: updateMap,
      click: addPoint
    };

    const mapMethods = {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      tileLayers: [
        { url: config.BASEMAP_LABEL_URL, zIndex: 0 },
        { url: config.BASEMAP_TILE_URL, zIndex: 1000 }
      ]
    };

    const mapOptions = {
      zoom: this.props.mapState.zoom,
      minZoom: 2,
      maxZoom: 7,
      zoomControl: false,
      center: [this.props.mapState.latLng.lat, this.props.mapState.latLng.lng]
    };

    // const columns = [
    //   {
    //     label: 'Name',
    //     value: 'name'
    //   },
    //   {
    //     label: 'Country',
    //     value: 'country'
    //   },
    //   {
    //     label: 'River Basin',
    //     value: 'basin'
    //   },
    //   {
    //     label: 'Regulatory & Reputational Risk',
    //     value: 'regulatory'
    //   }
    // ];

    const columns = [
      {
        label: 'Lat',
        value: 'lat'
      },
      {
        label: 'Lng',
        value: 'lng'
      }
    ];

    const markerIcon = L.divIcon({
      className: 'c-marker',
      html: '<div class="marker-inner"></div>'
    });

    return (
      <div className="c-map-page l-map-page">
        <Sidebar setSidebarWidth={() => {}}>
          <SegmentedUi
            className="-tabs"
            items={tabOptions}
            selected={this.props.scope}
            onChange={selected => this.props.setScope(selected.value)}
          />
          <div className="l-mapview-content">
            { this.props.scope === 'mapView' &&
              <MapView
                mapView={this.props.mapView}
                layers={layers}
                onSelectLayer={this.props.setActiveLayers}
                setFilters={this.props.setFilters}
                setPonderation={this.props.setPonderation}
              />
            }
            { this.props.scope === 'analyseLocations' &&
              <AnalyseLocations
                columns={columns}
                data={this.props.points}
                toggleModal={this.props.toggleModal}
                onRemovePoint={id => this.props.removePoint(id)}
              />
            }
            {/* TODO: functionallity */}
            <BtnMenu
              className="mapview-actions-menu -stacked -theme-sand"
              items={[{ label: 'Methodology' }, { label: 'Print / Share' }, { label: 'Download data' }]}
            />
          </div>
        </Sidebar>
        <Map
          listeners={listeners}
          mapMethods={mapMethods}
          layers={this.props.layersActive}
          mapOptions={mapOptions}
          markers={this.props.scope === 'analyseLocations' ? this.props.points : []}
          markerIcon={markerIcon}
        />
        <ZoomControl
          zoom={this.props.mapState.zoom}
          onZoomChange={zoom => this.props.setMapParams({ zoom })}
        >
          <button type="button" className="btn-help">?</button>
        </ZoomControl>
      </div>
    );
  }
}

MapPage.propTypes = {
  // State
  mapState: React.PropTypes.object,
  mapView: React.PropTypes.object,
  scope: React.PropTypes.string,
  points: React.PropTypes.array,
  // Selector
  layersActive: React.PropTypes.array,
  // Actions
  toggleModal: React.PropTypes.func,
  setMapParams: React.PropTypes.func,
  setScope: React.PropTypes.func,
  updateUrl: React.PropTypes.func,
  setFilters: React.PropTypes.func,
  setActiveLayers: React.PropTypes.func,
  setPonderation: React.PropTypes.func,
  addPoint: React.PropTypes.func,
  removePoint: React.PropTypes.func
};
