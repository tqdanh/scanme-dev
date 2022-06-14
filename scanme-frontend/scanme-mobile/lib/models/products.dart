import 'dart:async' show Future;
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:scanme_mobile_temp/models/company.dart';
import 'package:scanme_mobile_temp/models/location_activity.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:geolocator/geolocator.dart';
import '../constants.dart';
import '../login.dart';
import 'package:scanme_mobile_temp/users.dart';

Products myProducts = Products(products: []);

class Products {
  List<Product> products;

  Products({
    required this.products,
  });

  factory Products.fromJson(List<dynamic> parsedJson) {
    List<Product> _products = <Product>[];
    _products = parsedJson.map((i) => Product.fromJson(i)).toList();

    return Products(products: _products);
  }
}

class Product {
  Product(
      {this.code,
      this.name,
      this.status,
      this.actioncode,
      this.point,
      this.image_ads,
      this.image_unit,
      this.introduction,
      this.exp,
      this.mfg,
      this.lot,
      this.company,
      this.traceability_locations,
      this.ingredient_descriptions,
      this.promotion_descriptions,
      this.ads_descriptions});

  String? code;
  String? name;
  int? status;
  int? actioncode;
  int? point;
  String? image_ads;
  String? image_unit;
  String? introduction;
  String? exp;
  String? mfg;
  String? lot;
  Company? company;
  List<MapLocation>? traceability_locations;
  List<Description>? ingredient_descriptions;
  List<Description>? promotion_descriptions;
  List<Description>? ads_descriptions;

  String get tag => code ?? ''; // Assuming that all asset names are unique.
  bool get isValid => code != null && name != null;

  factory Product.fromJson(Map<String, dynamic> parsedJson) {
    var traceabilityLocationsfromJson =
        parsedJson['traceability_locations'] as List;
    List<MapLocation> _traceability_locations = traceabilityLocationsfromJson
        .map((i) => MapLocation.fromJson(i))
        .toList();

    var ingredientDescriptionsfromJson =
        parsedJson['ingredient_descriptions'] as List;
    List<Description> _ingredient_descriptions = ingredientDescriptionsfromJson
        .map((i) => Description.fromJson(i))
        .toList();

    var promotionDescriptionsfromJson =
        parsedJson['promotion_descriptions'] as List;
    List<Description> _promotion_descriptions = promotionDescriptionsfromJson
        .map((i) => Description.fromJson(i))
        .toList();

    var adsDescriptionsfromJson = parsedJson['ads_descriptions'] as List;
    List<Description> _ads_descriptions =
        adsDescriptionsfromJson.map((i) => Description.fromJson(i)).toList();

    return Product(
        code: parsedJson['code'],
        name: parsedJson['name'],
        status: parsedJson['status'],
        actioncode: parsedJson['actioncode'],
        point: parsedJson['point'],
        image_ads: parsedJson['image_ads'],
        image_unit: parsedJson['image_unit'],
        introduction: parsedJson['introduction'],
        exp: parsedJson['exp'],
        mfg: parsedJson['mfg'],
        lot: parsedJson['lot'],
        company: Company.fromJson(parsedJson['company']),
        traceability_locations: _traceability_locations,
        ingredient_descriptions: _ingredient_descriptions,
        promotion_descriptions: _promotion_descriptions,
        ads_descriptions: _ads_descriptions);
  }
}

Future<String> _loadProductAsset() async {
  return await rootBundle.loadString('jsons/products.json');
}

Future loadProducts() async {
  String jsonProducts = await _loadProductAsset();
  final jsonResponse = json.decode(jsonProducts);
  myProducts = Products.fromJson(jsonResponse);
}

Product getProductFromCode(String code) {
  Product _product = Product();
  myProducts.products.forEach((p) {
    if (p.code == code) {
      _product = p;
    }
  });
  if (_product != null)
    return _product;
  else
    return Product();
}

Future<Product> fetchProduct(String code) async {
  var bodycontain = "";
  Position currentLocation;

  List<String> temps = code.split("currentTransId=");
  if (temps.length >= 2) code = temps[1];

  currentLocation = await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high);

  if (mainuser.userId == null) {
    bodycontain = json.encode({
      "location": [
        currentLocation.latitude.toString(),
        currentLocation.longitude.toString()
      ]
    });
  } else {
    bodycontain = json.encode({
      "userId": mainuser.userId,
      "name": mainuser.name,
      "email": mainuser.email,
      "sso": mainuser.sso == SSO_GOOGLE ? "SSO_GOOGLE" : "SSO_FACEBOOK",
      "location": [
        currentLocation.latitude.toString(),
        currentLocation.longitude.toString()
      ]
    });
  }

  final response =
      // await http.get(SERVER_API + '/traceProduct?currentTransId=' + code);
      await http.put(
    Uri.parse(SERVER_API + '/traceProduct?currentTransId=' + code),
    body: bodycontain,
    headers: {'Content-type': 'application/json', 'Accept': 'application/json'},
  );

  if (response.statusCode == 200) {
    // If the call to the server was successful, parse the JSON.
    return Product.fromJson(json.decode(response.body));
  } else {
    // If that call was not successful, throw an error.
    throw Exception('Failed to load products');
  }
}

Future<int> countScanLocation(String transactionId) async {
  var connectivityResult = await (Connectivity().checkConnectivity());
  String body = "0";
  if (connectivityResult == ConnectivityResult.mobile ||
      connectivityResult == ConnectivityResult.wifi) {
    final response = await http.get(Uri.parse(SERVER_API +
        "/countLocationProductsByTxId?transactionId=" +
        transactionId));
    if (response.statusCode == 200) {
      body = response.body.toString();
    } else {
      return 0;
    }
  }
  return int.parse(body);
}

Future<List<MapLocation>?> getMapLocation(String transactionId) async {
  var connectivityResult = await (Connectivity().checkConnectivity());
  MapLocation myMapLocation;
  String body;
  if (connectivityResult == ConnectivityResult.mobile ||
      connectivityResult == ConnectivityResult.wifi) {
    final response = await http.get(
        Uri.parse(SERVER_API + "/traceSource?currentTransId=" + transactionId));
    if (response.statusCode == 200) {
      Map<String, dynamic> map = json.decode(response.body);
      var traceabilityLocationsfromJson = map['traceability_locations'] as List;
      List<MapLocation> _traceability_locations = traceabilityLocationsfromJson
          .map((i) => MapLocation.fromJson(i))
          .toList();
      return _traceability_locations;
    } else {
      return null;
      // body = await rootBundle.loadString('jsons/assets.json');
    }
  } else {
    return null;
  }
}

Future<String?> getTransaction(String transactionId) async {
  var connectivityResult = await (Connectivity().checkConnectivity());
  if (connectivityResult == ConnectivityResult.mobile ||
      connectivityResult == ConnectivityResult.wifi) {
    final response = await http.get(Uri.parse(
        SERVER_API + "/getTransaction?transactionId=" + transactionId));
    if (response.statusCode == 200) {
      return response.body;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

class MapLocation {
  String? companyid;
  String? name;
  String? description;
  String? logo;
  List<double>? location;
  String? location_description;
  List<LocationActivity>? attributes;

  MapLocation(
      {this.companyid,
      this.name,
      this.description,
      this.logo,
      this.location,
      this.location_description,
      this.attributes});

  factory MapLocation.fromJson(Map<String, dynamic> parsedJson) {
    var locationsFromJson = parsedJson['location'];
    List<double> _location = locationsFromJson.cast<double>();

    var attributesfromJson = parsedJson['attributes'] as List;
    List<LocationActivity> _attributes =
        attributesfromJson.map((i) => LocationActivity.fromJson(i)).toList();

    return MapLocation(
      companyid: parsedJson['companyid'],
      name: parsedJson['name'],
      description: parsedJson['description'],
      logo: parsedJson['logo'],
      location: _location,
      location_description: parsedJson['location_description'],
      attributes: _attributes,
    );
  }
}

class Description {
  String? title;
  String? description;
  List<String>? images;
  List<String>? notes;
  List<Attribute>? attributes;

  Description(
      {this.title, this.description, this.images, this.attributes, this.notes});

  factory Description.fromJson(Map<String, dynamic> parsedJson) {
    var imagesFromJson = parsedJson['images'];
    List<String> _images = imagesFromJson.cast<String>();

    var notesFromJson = parsedJson['notes'];
    List<String> _notes = notesFromJson.cast<String>();

    var attributesfromJson = parsedJson['attributes'] as List;
    List<Attribute> _attributes =
        attributesfromJson.map((i) => Attribute.fromJson(i)).toList();

    return Description(
      title: parsedJson['title'],
      description: parsedJson['description'],
      images: _images,
      attributes: _attributes,
      notes: _notes,
    );
  }
}

class Attribute {
  String? id;
  String? name;
  String? value;

  Attribute({this.id, this.name, this.value});

  factory Attribute.fromJson(Map<String, dynamic> parsedJson) {
    return Attribute(
      id: parsedJson['id'],
      name: parsedJson['name'],
      value: parsedJson['value'],
    );
  }
}

class Source {
  Source({this.productLine, this.transactionId, this.outputIndex});

  String? productLine;
  String? transactionId;
  String? outputIndex;

  factory Source.fromJson(Map<String, dynamic> parsedJson) {
    return Source(
        productLine: parsedJson['productLine'],
        transactionId: parsedJson['transactionId'],
        outputIndex: parsedJson['outputIndex']);
  }
}
