import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'models/products.dart';
import 'styles.dart';
import 'ads_view.dart';

class ProductAds extends StatefulWidget {
  ProductAds({Key? key, required this.product}) : super(key: key);

  final Product product;

  @override
  _ProductAdsState createState() => _ProductAdsState();
}

class _ProductAdsState extends State<ProductAds> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  final TextStyle titleStyle = const ProductStyle(fontSize: 25.0, fontWeight: null, height: null);
  final TextStyle descriptionStyle = ProductStyle(
      fontSize: 15.0, color: Colors.black54, height: 20.0 / 15.0);
  final TextStyle itemStyle =
      const ProductStyle(fontSize: 15.0, height: 24.0 / 15.0);
  final TextStyle headingStyle = const ProductStyle(
      fontSize: 16.0, fontWeight: FontWeight.bold, height: 24.0 / 15.0);

  Product _product = Product();

  @override
  void initState() {
    _product = widget.product;

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    List<Widget> allads = <Widget>[];

    _product.ads_descriptions?.forEach((ad) => {allads.addAll(_buildAds(ad))});

    return Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          const Padding(
            padding: EdgeInsets.all(10),
          )
        ]..addAll(allads));
  }

  List<Widget> _buildAds(Description ad) {
    return <Widget>[
      Padding(
        padding: const EdgeInsets.only(top: 0, bottom: 4.0),
        child: Text(ad.description ?? '', style: descriptionStyle),
      ),
      Padding(
        padding: const EdgeInsets.only(top: 8.0, bottom: 10.0),
        child: Text(ad.title ?? '', style: headingStyle),
      ),
      Table(
          defaultVerticalAlignment: TableCellVerticalAlignment.top,
          columnWidths: const <int, TableColumnWidth>{
            0: FixedColumnWidth(130.0)
          },
          children: <TableRow>[]
            ..addAll(ad.attributes!.map<TableRow>((Attribute att) {
              return _buildAdsAttribute(att);
            }))),
    ];
  }

  TableRow _buildAdsAttribute(Attribute attribute) {
    return TableRow(
      children: <Widget>[
        GestureDetector(
            onTap: () {
              Navigator.push(
                  this.context,
                  MaterialPageRoute<void>(
                    settings: const RouteSettings(name: '/ads'),
                    builder: (BuildContext context) {            
                      return AdsPage(product: _product, attribute: attribute, code: '', );
                    },
                  ));
            },
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Container(
                  alignment: Alignment.topCenter,
                  width: 80,
                  height: 120,
                  child: Image.asset("images/ + ${attribute.value}")),
            )),
        Padding(
          padding: const EdgeInsets.fromLTRB(4.0, 10, 4, 10),
          child: Text(attribute.value ?? ''),
        ),
      ],
    );
  }
}
