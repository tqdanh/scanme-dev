import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:url_launcher/url_launcher.dart';
import 'models/products.dart';
import 'styles.dart';

class AdsPage extends StatefulWidget {
  const AdsPage({Key key, this.product, this.code, this.attribute})
      : super(key: key);

  final Product product;
  final String code;
  final Attribute attribute;

  @override
  _AdsPageState createState() => _AdsPageState();
}

class _AdsPageState extends State<AdsPage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  final TextStyle menuItemStyle = const ProductStyle(
      fontSize: 15.0, color: Colors.black54, height: 24.0 / 15.0);

  double _getAppBarHeight(BuildContext context) =>
      MediaQuery.of(context).size.height * 0.3;

  Product _product;
  Attribute _attribute;

  @override
  void initState() {
    _product = this.widget.product;
    _attribute = this.widget.attribute;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final double appBarHeight = _getAppBarHeight(context);
    final Size screenSize = MediaQuery.of(context).size;
    final bool fullWidth = screenSize.width < kPageMaxWidth;

    return Scaffold(
      key: _scaffoldKey,
      body: Stack(
        children: <Widget>[
          Positioned(
            top: 0.0,
            left: 0.0,
            right: 0.0,
            height: appBarHeight + kHalfSize,
            child: Hero(
              tag: 'package/${_product.image_ads}',
              child: Image.asset(
                "images/" + _attribute.value,
                fit: BoxFit.cover,
              ),
            ),
          ),
          CustomScrollView(
            slivers: <Widget>[
              SliverAppBar(
                expandedHeight: appBarHeight - kHalfSize,
                backgroundColor: Colors.transparent,
                flexibleSpace: const FlexibleSpaceBar(
                  background: DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment(0.0, -1.0),
                        end: Alignment(0.0, -0.2),
                        colors: <Color>[Color(0x60000000), Color(0x00000000)],
                      ),
                    ),
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Stack(
                  children: <Widget>[
                    Container(
                      padding: const EdgeInsets.only(top: kHalfSize),
                      width: fullWidth ? null : kPageMaxWidth,
                      child: ProductSheet(
                          product: widget.product, code: widget.code, attribute: _attribute,),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class ProductSheet extends StatefulWidget {
  const ProductSheet({Key key, this.product, this.code, this.attribute}) : super(key: key);

  final Product product;
  final Attribute attribute;
  final String code;

  @override
  _ProductSheetState createState() => _ProductSheetState();
}

class _ProductSheetState extends State<ProductSheet>
    with SingleTickerProviderStateMixin {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();


  final TextStyle titleStyle = const ProductStyle(fontSize: 25.0);
  final TextStyle descriptionStyle = const ProductStyle(
      fontSize: 15.0, color: Colors.black54, height: 20.0 / 15.0);
  final TextStyle errorStyle = const ProductStyle(
      fontSize: 15.0, color: Colors.red, height: 20.0 / 15.0);
  final TextStyle itemStyle =
      const ProductStyle(fontSize: 15.0, height: 24.0 / 15.0);
  final TextStyle itemAmountStyle = ProductStyle(
      fontSize: 15.0, color: kTheme.primaryColor, height: 24.0 / 15.0);
  final TextStyle headingStyle = const ProductStyle(
      fontSize: 16.0, fontWeight: FontWeight.bold, height: 24.0 / 15.0);
  final TextStyle alertStyle = const ProductStyle(
      fontSize: 15.0,
      color: Colors.red,
      fontWeight: FontWeight.w500,
      height: 16.0 / 15.0);

  Product product;
  Attribute attribute;
  String code;

  @override
  void initState() {
    product = widget.product;
    attribute = widget.attribute;
    code = widget.code;

   super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      child: SafeArea(
        top: false,
        bottom: false,
        child: Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 16.0, vertical: 40.0),
            child: Column(children: <Widget>[
              Table(
                  columnWidths: const <int, TableColumnWidth>{
                    0: FixedColumnWidth(64.0)
                  },
                  children: <TableRow>[
                    TableRow(children: <Widget>[
                      TableCell(
                          verticalAlignment: TableCellVerticalAlignment.middle,
                          child: Image.asset("images/" + attribute.value,
                              width: 40.0,
                              height: 80.0,
                              alignment: Alignment.centerLeft,
                              fit: BoxFit.scaleDown)),
                      TableCell(
                          verticalAlignment: TableCellVerticalAlignment.middle,
                          child: Text(product.name, style: titleStyle)),
                    ]),
                    TableRow(children: <Widget>[
                      const SizedBox(),
                      Padding(
                          padding: const EdgeInsets.only(top: 8.0, bottom: 4.0),
                          child: Text(product.introduction,
                              style: descriptionStyle)),
                    ]),
                  ]),
              new Padding(
                padding: EdgeInsets.all(10),
              ),
            ])),
      ),
    );
  }

  _launchURL() async {
    String url =
        'https://vinamilk.com.vn/sua-tuoi-vinamilk/vi/nhan-hang/sua-tuoi-tiet-trung/';

    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }
}
