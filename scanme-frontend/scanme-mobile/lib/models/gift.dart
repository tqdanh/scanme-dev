import 'package:WEtrustScanner/models/company.dart';

class Gift {
  Gift({this.id,this.name, this.image, this.expirydate, this.quantity, this.point, this.company});

  final String id;
  final String name;
  final String image;
  final String expirydate;
  final int quantity;
  final int point;
  final Company company;

  factory Gift.fromJson(Map<String, dynamic> parsedJson) {
    return Gift(
      id: parsedJson['_id'],
      name: parsedJson['name'],
      image: parsedJson['image'],
      expirydate: parsedJson['expirydate'],
      quantity: parsedJson['quantity'],
      point: parsedJson['point'],
      company: Company.fromJson(parsedJson['company']),
    );
  }
}
