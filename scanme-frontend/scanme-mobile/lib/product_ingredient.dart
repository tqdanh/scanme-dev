import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'models/products.dart';
import 'styles.dart';

class ProductIngredient extends StatefulWidget {
  ProductIngredient({Key? key, required this.product}) : super(key: key);

  final Product product;

  @override
  _ProductIngredientState createState() => _ProductIngredientState();
}

class _ProductIngredientState extends State<ProductIngredient> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

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

  Product _product = Product();

  @override
  void initState() {
    _product = widget.product;

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    List<Widget> allingredients = <Widget>[];

    for (var ingre in _product.ingredient_descriptions!) {
      allingredients.addAll(_buildIngredient(ingre));
    }

    return Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          const Padding(
            padding: EdgeInsets.all(10),
          )
        ]..addAll(allingredients));
  }

  List<Widget> _buildIngredient(Description ingredient) {
    return <Widget>[
      Padding(
        padding: const EdgeInsets.only(top: 0, bottom: 4.0),
        child: Text(ingredient.description ?? '', style: descriptionStyle),
      ),
      Container(
        padding: EdgeInsets.all(10),
        child: Image.asset('images/' + ingredient.images![0], fit: BoxFit.cover),
      ),
      Padding(
        padding: const EdgeInsets.only(top: 8.0, bottom: 4.0),
        child: Text(ingredient.title ?? '', style: headingStyle),
      ),
      Table(
          columnWidths: const <int, TableColumnWidth>{
            0: FixedColumnWidth(200.0)
          },
          children: <TableRow>[]
            ..addAll(ingredient.attributes!.map<TableRow>((Attribute att) {
              return _buildIngredientAttribute(att);
            }))),
    ];
  }

  TableRow _buildIngredientAttribute(Attribute attribute) {
    return TableRow(
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 4.0),
          child: Text(attribute.name ?? '', style: itemAmountStyle),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 4.0),
          child: Text(attribute.value ?? '', style: itemStyle),
        ),
      ],
    );
  }
}
