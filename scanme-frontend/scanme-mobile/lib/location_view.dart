import 'package:WEtrustScanner/models/location_activity.dart';
import 'package:WEtrustScanner/models/location_factory.dart';
import 'package:WEtrustScanner/product_view.dart';
import 'package:flutter/material.dart';
import 'dart:convert';
import 'constants.dart';
import 'models/products.dart';
import 'custom_dialog.dart' as customDialog;

class LocationView extends StatefulWidget {
  const LocationView({Key key, this.location, this.product}) : super(key: key);
  final MapLocation location;
  final Product product;
  @override
  _LocationViewState createState() => _LocationViewState();
}

class _LocationViewState extends State<LocationView> {
  List<LocationActivity> activities;
  Future<List<LocationActivity>> futureactivities;

  @override
  void initState() {
    activities = widget.location.attributes;
    super.initState();
  }

  @override
  build(BuildContext context) {
    return Scaffold(
        appBar: new AppBar(
          title: Text(widget.location.name),
        ),
        body: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.max,
            children: <Widget>[
              Padding(
                  padding: EdgeInsets.fromLTRB(15, 15, 0, 15),
                  child: Text(
                    widget.location.description,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w400,
                    ),
                  )),
              Image.asset("images/" + widget.location.logo),
              Padding(
                  padding: EdgeInsets.fromLTRB(15, 15, 0, 15),
                  child: Center(
                      child: Text(
                    "HOẠT ĐỘNG CHÍNH",
                    style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.teal),
                  ))),
              Expanded(
                  child: SingleChildScrollView(
                      child: buildLocationDetails(context)))
            ]));
  }

  Widget buildLocationDetails(BuildContext context) {
    if (activities == null) return Container();

    return ExpansionPanelList(
        expansionCallback: (int index, bool isExpanded) {
          setState(() {
            activities[index].isExpanded = !isExpanded;
          });
        },
        children: activities.map<ExpansionPanel>((LocationActivity item) {
          List<Widget> contents = List<Widget>();
          item.content.forEach((t) => contents.add(Text(t)));
          if (item.sources != null) {
            contents.add(Text("\nNguyên liệu:", style: TextStyle(fontSize: 16)));
            List<Object> objects = item.sources;
            objects.forEach((t) => contents.add(_getSources(context, Source.fromJson(t))));

          }
          return ExpansionPanel(
              headerBuilder: (BuildContext context, bool isExpanded) {
                return ListTile(
                  title: Text(item.activity),
                  subtitle: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [Text('Ngày tạo: ' + item.time),
                      GestureDetector(
                          onTap: () {
                            _getTransaction(context, item.transactionId);
                          },
                          child: Text('Mã blockchain: ' + item.transactionId, style: TextStyle(fontSize: 14, color: Colors.blueAccent),)
                      )],
                  )
                );
              },
              body: ListTile(
                  title: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: contents,
              )),
              isExpanded: item.isExpanded);
        }).toList());
  }

  Widget _getSources(BuildContext context, Source source) {
    return Container(
      child: Padding(
        padding: EdgeInsets.all(10),
        child: GestureDetector(
            onTap: () {
              // print("abc");
              _getProductFromCode(context, source.transactionId);
            },
            child: Text(source.productLine, style: TextStyle(fontSize: 14, color: Colors.blueAccent),)
        ),
      ),
    );
  }

  void _getProductFromCode(BuildContext context, String transId) async{
    List<MapLocation> mapLocation = await getMapLocation(transId);
    if (mapLocation != null) {
      Product p = widget.product;
      p.traceability_locations = mapLocation;
      Navigator.push(
          context,
          MaterialPageRoute<void>(
            settings: const RouteSettings(),
            builder: (BuildContext context) {
              return ProductPage(product: p, code: p.code);
            },
          ));
    }
  }

  void _getTransaction(BuildContext context, String transId) async{
    Object transactionRaw = await getTransaction(transId);
    var object = json.decode(transactionRaw);
    var transaction = JsonEncoder.withIndent('  ').convert(object);
    if (transaction != null) {
      customDialog.showDialog(
        context: context,
        builder: (BuildContext context) {
          // return object of type Dialog
          return customDialog.AlertDialog(
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                Container(
                  height: (MediaQuery.of(context).size.height / 2) + 20,
                  child:  ListView(
                    children: <Widget>[
                      Container(
                        height: 2000,
                        color: Colors.grey,
                        child: Text(transaction, style: TextStyle(fontSize: 15, fontStyle: FontStyle.italic ,fontWeight: FontWeight.normal)),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(10, 30, 10, 10),
                  child: ButtonTheme(
                    minWidth: 50.0,
                    height: 50,
                    child: RaisedButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      color: Colors.lightBlue,
                      textColor: Colors.white,
                      child: Text("OK", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    ),
                  ),
                )
              ],
            ),
          );
        },
      );
    }
  }


}
