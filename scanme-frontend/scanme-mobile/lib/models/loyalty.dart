import 'package:scanme_mobile_temp/models/company.dart';

class Loyalty {
  Loyalty({
    required this.id,
    required this.owner,
    required this.cardnumber,
    required this.type,
    required this.point,
    required this.company,
  });

  final String id;
  final String owner;
  final String cardnumber;
  final int type;
  int point;
  final Company company;

  factory Loyalty.fromJson(Map<String, dynamic> parsedJson) {
    return Loyalty(
      id: parsedJson['_id'],
      owner: parsedJson['owner'],
      cardnumber: parsedJson['cardnumber'],
      type: parsedJson['type'],
      point: parsedJson['point'],
      company: Company.fromJson(parsedJson['company']),
    );
  }

  String printCardType() {
    switch (type) {
      case 1:
        return "CHUẨN";
        break;
      case 2:
        return "BẠC";
        break;
      case 3:
        return "VÀNG";
        break;
      default:
        return "";
    }
  }
}
