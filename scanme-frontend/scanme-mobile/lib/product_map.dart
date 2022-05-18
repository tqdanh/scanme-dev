import 'package:WEtrustScanner/location_view.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart' as LocationManager;
import 'package:flutter/gestures.dart';
import 'package:flutter/foundation.dart';
import 'package:location/location.dart';
import 'models/products.dart';
import 'styles.dart';

class _MapColor {
  _MapColor(this.locationName, this.color, this.bitmapDescriptor);
  String locationName;
  Color color;
  double bitmapDescriptor;
}

class ProductMap extends StatefulWidget {
  ProductMap({Key key, this.product}) : super(key: key);

  final Product product;

  @override
  _ProductMapState createState() => _ProductMapState();
}

class _ProductMapState extends State<ProductMap> {
  List<_MapColor> _MapColors = <_MapColor>[
    _MapColor("", Colors.orange, BitmapDescriptor.hueOrange),
    _MapColor("", Colors.purple, BitmapDescriptor.hueViolet),
    _MapColor("", Colors.blue, BitmapDescriptor.hueBlue),
    _MapColor("", Colors.cyan, BitmapDescriptor.hueCyan),
    _MapColor("", Colors.yellow, BitmapDescriptor.hueYellow),
    _MapColor("", Colors.green, BitmapDescriptor.hueGreen),
    _MapColor("", Colors.pink, BitmapDescriptor.hueRose),
    _MapColor("", Colors.red, BitmapDescriptor.hueRed),
  ];

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  Map<MarkerId, Marker> markers = <MarkerId, Marker>{};

  final TextStyle titleStyle = const ProductStyle(fontSize: 25.0);
  final TextStyle descriptionStyle = const ProductStyle(
      fontSize: 15.0, color: Colors.black54, height: 20.0 / 15.0);
  final TextStyle itemStyle =
      const ProductStyle(fontSize: 15.0, height: 24.0 / 15.0);
  final TextStyle itemAmountStyle = ProductStyle(
      fontSize: 15.0, color: kTheme.primaryColor, height: 18.0 / 15.0);
  final TextStyle headingStyle = const ProductStyle(
      fontSize: 16.0, fontWeight: FontWeight.bold, height: 24.0 / 15.0);
  final TextStyle alertStyle = const ProductStyle(
      fontSize: 15.0,
      color: Colors.red,
      fontWeight: FontWeight.w500,
      height: 16.0 / 15.0);

  GoogleMapController mapController;
  Product _product;

  @override
  void initState() {
    _product = widget.product;
    super.initState();
    addMarkers();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
        initialData: Container(),
        future: buildMap(),
        builder: (BuildContext context, AsyncSnapshot<Widget> widget) {
          return widget.data;
        });
  }

  Future<Widget> buildMap() async {
    await addMarkers();
    return Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
              height: 300,
              width: MediaQuery.of(context).size.width,
              child: GoogleMap(
                  initialCameraPosition: const CameraPosition(
                    target: LatLng(10.847703, 106.626562),
                    zoom: 11.0,
                  ),
                  onMapCreated: _onMapCreated,
                  myLocationEnabled: true,
                  markers: Set<Marker>.of(markers.values),
                  zoomGesturesEnabled: true,
                  scrollGesturesEnabled: true,
                  gestureRecognizers: Set()
                    ..add(Factory<PanGestureRecognizer>(
                        () => PanGestureRecognizer())))),
          Table(
              columnWidths: const <int, TableColumnWidth>{
                0: FixedColumnWidth(64.0)
              },
              children: <TableRow>[
                TableRow(
                  children: <Widget>[
                    GestureDetector(
                      onTap: () {
                        zoom();
                      },
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4.0),
                        child: Icon(Icons.location_on,
                            color: Colors.red, size: 40),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0, bottom: 4.0),
                      child: Text("Vị trí quét", style: headingStyle),
                    )
                  ],
                ),
                TableRow(
                  children: <Widget>[
                    const SizedBox(),
                    Padding(
                      padding: const EdgeInsets.only(top: 0, bottom: 4.0),
                      child: Text("Đây là vị trí bạn đang quét mã sản phẩm",
                          style: descriptionStyle),
                    )
                  ],
                ),
              ]..addAll(_product.traceability_locations
                    .map<TableRow>((MapLocation location) {
                  return _buildLocations(location);
                }))),
        ]);
  }

  void refresh() async {
    final center = await getUserLocation();

    mapController.animateCamera(CameraUpdate.newCameraPosition(CameraPosition(
        target: center == null ? LatLng(0, 0) : center, zoom: 6.5)));
  }

  void zoom({LatLng point}) async {
    if (point == null) point = await getUserLocation();

    mapController.animateCamera(CameraUpdate.newCameraPosition(CameraPosition(
        target: point == null ? LatLng(0, 0) : point, zoom: 15)));
  }

  void _onMapCreated(GoogleMapController controller) async {
    mapController = controller;
    refresh();
  }

  Future<LatLng> getUserLocation() async {
    LocationData currentLocation;
    final location = LocationManager.Location();
    try {
      currentLocation = await location.getLocation();
      final lat = currentLocation.latitude;
      final lng = currentLocation.longitude;
      final center = LatLng(lat, lng);
      return center;
    } on Exception {
      currentLocation = null;
      return null;
    }
  }

  void addMarkers() async {
    List<MarkerId> idList = List<MarkerId>();
    List<Marker> markerList = List<Marker>();

    final center = await getUserLocation();

    String markerIdValue1 = "Vị trí quét";
    MarkerId markerId1 = new MarkerId(markerIdValue1);
    Marker marker1 = new Marker(
      icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
      markerId: markerId1,
      position: center,
      visible: true,
      infoWindow: InfoWindow(title: markerIdValue1, snippet: ''),
    );
    idList.add(markerId1);
    markerList.add(marker1);
    markers[markerId1] = marker1;

    for (int i = 0; i < _product.traceability_locations.length; i++) {
      String markerIdValue = _product.traceability_locations[i].name;
      MarkerId markerId = new MarkerId(markerIdValue);
      Marker marker = new Marker(
        icon: BitmapDescriptor.defaultMarkerWithHue((i < _MapColors.length - 1)
            ? _MapColors[i].bitmapDescriptor
            : BitmapDescriptor.hueRed),
        markerId: markerId,
        position: LatLng(_product.traceability_locations[i].location[0],
            _product.traceability_locations[i].location[1]),
        visible: true,
        infoWindow: InfoWindow(title: markerIdValue, snippet: ''),
      );

      idList.add(markerId);
      markerList.add(marker);
      markers[markerId] = marker;
      if (i < _MapColors.length - 1) {
        _MapColors[i].locationName = markerIdValue;
      }
    }
  }

  TableRow _buildLocations(MapLocation location) {
    String attributes = "";
    if (location.attributes.length == 1)
      attributes =
          location.attributes[0].time + ": " + location.attributes[0].activity;
    else {
      attributes = location.attributes[0].time +
          ": " +
          location.attributes[0].activity +
          "\n";
      attributes = attributes +
          location.attributes[location.attributes.length - 1].time +
          ": " +
          location.attributes[location.attributes.length - 1].activity;
    }
    // location.attributes.forEach(
    //     (a) => {attributes = attributes + a.time + ": " + a.activity + "\n"});
    // attributes = attributes.substring(0, attributes.length - 1);

    Color color = Colors.red;
    _MapColor mapColor = _MapColors.firstWhere(
        (c) => c.locationName == location.name,
        orElse: () => null);
    if (mapColor != null) color = mapColor.color;

    return TableRow(
      children: <Widget>[
        GestureDetector(
          onTap: () {
            zoom(point: LatLng(location.location[0], location.location[1]));
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 4.0),
            child: Icon(Icons.location_on, color: color, size: 40),
          ),
        ),
        GestureDetector(
            onTap: () {
              Navigator.push(
                  context,
                  MaterialPageRoute<void>(
                    settings:
                        const RouteSettings(name: '/product/locationdetail'),
                    builder: (BuildContext context) {
                      return LocationView(
                        location: location,
                        product: _product
                      );
                    },
                  ));
            },
            child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 4.0),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: <Widget>[
                      Text(location.name, style: headingStyle),
                      Text(location.location_description,
                          style: itemAmountStyle),
                      Text(location.description, style: descriptionStyle),
                      Text(attributes, style: itemStyle),
                    ]))),
      ],
    );
  }

}
