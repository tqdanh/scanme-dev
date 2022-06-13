import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'models/products.dart';
import 'styles.dart';

class ProductPromotion extends StatefulWidget {
  ProductPromotion({Key? key, required this.product}) : super(key: key);

  final Product product;

  @override
  _ProductPromotionState createState() => _ProductPromotionState();
}

class _ProductPromotionState extends State<ProductPromotion> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  Product _product = Product();

  @override
  void initState() {
    _product = widget.product;

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return _buildPromotion(_product.promotion_descriptions);
  }

  Widget _buildPromotion(List<Description>? promotions) {
    List<Widget> allpromotions = <Widget>[];

    for (var pro in _product.promotion_descriptions!) {
      allpromotions.add(PromotionCard(
        promotion: pro,
        onTap: () {},
      ));
    }

    return Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Padding(
            padding: EdgeInsets.all(10),
          )
        ]..addAll(allpromotions));
  }
}

class PromotionCard extends StatelessWidget {
  PromotionCard({Key? key, required this.promotion, required this.onTap})
      : super(key: key);

  TextStyle get titleStyle =>
      const ProductStyle(fontSize: 16.0, fontWeight: FontWeight.w500);
  final TextStyle descriptionStyle = const ProductStyle(
      fontSize: 15.0, color: Colors.black54, height: 20.0 / 15.0);
  final TextStyle itemStyle =
      const ProductStyle(fontSize: 15.0, height: 20.0 / 15.0);

  final Description promotion;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    List<Widget> allattribute = <Widget>[];

    for (var att in promotion.attributes!) {
      allattribute.addAll(_buildPromotionAttribute(att));
    }
    return GestureDetector(
      onTap: onTap,
      child: Card(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Hero(
              tag: 'packages/${promotion.images![0]}',
              child: AspectRatio(
                aspectRatio: 3.0 / 2.0,
                child: Image.asset(
                  "images/" + promotion.images![0],
                  fit: BoxFit.cover,
                  semanticLabel: promotion.title,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(8.0, 15.0, 8.0, 4.0),
              child: Text(promotion.title ?? '', style: titleStyle),
            ),
          ]
            ..addAll(allattribute)
            ..add(Padding(
              padding: EdgeInsets.all(10),
            )),
        ),
      ),
    );
  }

  List<Widget> _buildPromotionAttribute(Attribute attribute) {
    return <Widget>[
      Padding(
        padding: const EdgeInsets.fromLTRB(8.0, 0, 8.0, 0),
        child: Text("${attribute.name}:", style: itemStyle),
      ),
      Padding(
        padding: const EdgeInsets.fromLTRB(8.0, 0, 8.0, 8),
        child: Text(attribute.value ?? '', style: descriptionStyle),
      ),
    ];
  }
}
