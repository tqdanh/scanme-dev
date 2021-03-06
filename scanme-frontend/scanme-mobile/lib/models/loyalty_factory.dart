import 'dart:convert';
import 'package:WEtrustScanner/constants.dart';
import 'package:flutter/services.dart';
import 'loyalty.dart';
import 'package:http/http.dart' as http;

LoyaltyFactory loyaltyCardFactory;

class LoyaltyFactory {
  final List<Loyalty> loyaltycards;

  LoyaltyFactory({
    this.loyaltycards,
  });

  factory LoyaltyFactory.fromJson(List<dynamic> parsedJson) {
    List<Loyalty> loyaltycards = new List<Loyalty>();
    loyaltycards = parsedJson.map((i) => Loyalty.fromJson(i)).toList();
    return new LoyaltyFactory(loyaltycards: loyaltycards);
  }
}

Future<String> _loadLoyaltyCardAsset() async {
  return await rootBundle.loadString('jsons/loyaltycard.json');
}

Future loadLoyaltyCards() async {
  String jsonCards = await _loadLoyaltyCardAsset();
  final jsonResponse = json.decode(jsonCards);
  loyaltyCardFactory = LoyaltyFactory.fromJson(jsonResponse);
}

Future<List<Loyalty>> fetchLoyaltyCards(String userid) async {
  final response = await http.get(SERVER_API +
      '/getLoyaltyCardByOwnerIdMobile?ownerId=' +
      userid.toString());

  if (response.statusCode == 200) {
    // If the call to the server was successful, parse the JSON.
    return LoyaltyFactory.fromJson(json.decode(response.body)).loyaltycards;
  } else {
    // If that call was not successful, throw an error.
    throw Exception('Failed to load loyalty cards');
  }
}
