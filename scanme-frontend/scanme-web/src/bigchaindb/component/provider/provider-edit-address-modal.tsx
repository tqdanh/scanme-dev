import * as React from 'react';
import {
    AppBar,
    Button, Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider, FormControl, Grid, InputLabel, MenuItem,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableRow, TextField,
    Typography
} from '@material-ui/core';
import {Map as LeafletMap, Marker, Popup, TileLayer} from 'react-leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import applicationContext from '../../config/ApplicationContext';
import {Autocomplete} from '@material-ui/lab';
import config from '../../../config';

export class ProviderEditAddressModal extends React.Component<any, any> {
    private providerService = applicationContext.getProviderService();

    constructor(props) {
        super(props);
        this.state = {
            markers: [{lat: this.props.cordinates[0], lng: this.props.cordinates[1]}],
            searchText: '',
            results: [],
            openAutoComplete: true,
            currentLocationName: this.props.providerAddress
        };
    }

    componentDidMount(): void {
        const defaultIcon = L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow
        });
        L.Marker.prototype.options.icon = defaultIcon;
        const {markers} = this.state;
        this.setState({markers: [...markers]}, () => {
            const markers1 = this.state.markers;
            if (markers1.length > 0) {
                this.providerService.searchLocation(`${markers1[0].lng},${markers1[0].lat}`).subscribe(res => {
                    if (res !== 'error') {
                        this.setState({
                            results: [{
                                place_name: this.state.currentLocationName,
                                center: [markers1[0].lng, markers1[0].lat]
                            }, ...res.features]
                        }, () => {
                        });
                    }
                });
            }

        });
    }

    addMarker = (e) => {
        const {markers} = this.state;
        markers.push(e.latlng);
        markers.shift(); // restrict only for one address chosen
        this.setState({markers: [...markers]}, () => {
            const markers1 = this.state.markers;
            if (markers1.length > 0) {
                this.providerService.searchLocation(`${markers1[0].lng},${markers1[0].lat}`).subscribe(res => {
                    if (res !== 'error') {
                        this.setState({
                            results: [{place_name: `${markers1[0].lng},${markers1[0].lat}`}, ...res.features],
                            currentLocationName: `${markers1[0].lng},${markers1[0].lat}`
                        }, () => {
                        });
                    }
                });
            }

        });
    }

    handleSearchLocation = (e) => {
        // if (!e.target.value) {
        //     this.setState({openAutoComplete: false});
        // }
        this.setState({searchText: e.target.value}, () => {
            if (this.state.searchText.trim().length > 0) {
                this.providerService.searchLocation(this.state.searchText.trim()).subscribe(res => {
                    if (res !== 'error') {
                        this.setState({results: res.features}, () => {
                        });
                    }
                });
            }
        });
    }

    handleSelectLocation = (event, value) => {
        if (!value) {
            return;
        }
        const {markers} = this.state;
        let currentLocationName = '';
        try {
            if (!value.center) {
                const coordinates = value.place_name.split(',');
                markers.push({lng: coordinates[0], lat: coordinates[1]});
            } else {
                markers.push({lng: value.center[0], lat: value.center[1]});
            }
            currentLocationName = value.place_name;
        } catch (e) {
            console.error(e);
        }
        markers.shift(); // restrict only for one address chosen
        this.setState({markers: [...markers], currentLocationName});
    }
    handleFilter = (options: any[], state: any) => {
        return [...options];
    }

    render() {
        return <Card className={'provider-info-table'} style={{width: '100%'}}>
            <CardHeader title={<Typography style={{fontWeight: 'bold'}}>
                {`Chỉnh sửa địa chỉ`}</Typography>}
            />
            <Divider/>
            <CardContent>
                <Grid item xs={12}>
                    <Autocomplete
                        freeSolo
                        // disableOpenOnFocus={false}
                        noOptionsText={''}
                        disableCloseOnSelect={false}
                        getOptionLabel={option => option.place_name}
                        options={this.state.results}
                        onChange={this.handleSelectLocation}
                        autoComplete={false}
                        autoSelect={true}
                        filterOptions={this.handleFilter}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label='Tìm kiếm vị trí'
                                fullWidth
                                variant='outlined'
                                value={this.state.searchText}
                                onChange={this.handleSearchLocation}
                            />
                        )}
                    />
                    <div style={{width: '100%', marginTop: 8}}>
                        <LeafletMap
                            center={this.state.markers[0]}
                            zoom={12}
                            onClick={this.addMarker}
                            maxZoom={20}
                            attributionControl={true}
                            zoomControl={true}
                            scrollWheelZoom={true}
                            dragging={true}
                            animate={true}
                            easeLinearity={0.35}
                        >
                            <TileLayer
                                attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                                url='https://api.mapbox.com/styles/v1/tqdanh/cl3ny9cba001j15mmvbw3x67v/tiles/512/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidHFkYW5oIiwiYSI6ImNsM254aDY4ajAyOG0zanAxdmg3MmFybDIifQ.mm5g3BEMeR1hV1c5M6sjlg'
                            />
                            {this.state.markers.map((p, idx) =>
                                <Marker key={`marker-${idx}`} position={p}>
                                    <Popup>
                                        <span>
                                             <img style={{borderRadius: 2, width: 150}}
                                                  src={`${config.imageURL}/${this.props.providerImageUrl}`}
                                                  alt='provider_image_map'/>
                                                  <br/>
                                            {`Đc: ${this.state.currentLocationName}`}
                                        </span>
                                    </Popup>
                                </Marker>
                            )}
                        </LeafletMap>
                    </div>
                </Grid>
            </CardContent>
            <Divider/>
            <CardActions style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button onClick={() => this.props.onClose()} size='small' variant='contained'>Hủy</Button>
                <Button color='primary' onClick={() => this.props.onClose({
                    selectedLocationName: this.state.currentLocationName,
                    coordinates: this.state.markers[0]
                })} size='small' variant='contained'>
                    Chọn </Button>
            </CardActions>
        </Card>;
    }
}
