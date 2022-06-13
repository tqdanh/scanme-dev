
import 'package:flutter/material.dart';

const double kHalfSize = 28.0;
const double kPageMaxWidth = 500.0;

final ThemeData kTheme = ThemeData(
  brightness: Brightness.light,
  primarySwatch: Colors.teal,
  accentColor: Colors.redAccent,
);

class ProductStyle extends TextStyle {
  const ProductStyle({
    double fontSize = 14.0,
    FontWeight? fontWeight,
    Color color = Colors.black87,
    double? letterSpacing,
    double? height,
  }) : super(
          inherit: false,
          color: color,
          fontSize: fontSize,
          fontWeight: fontWeight,
          textBaseline: TextBaseline.alphabetic,
          letterSpacing: letterSpacing,
          height: height,
        );
}
