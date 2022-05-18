import 'dart:convert';
import 'package:WEtrustScanner/constants.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/services.dart';
import 'gift.dart';

GiftFactory giftFactory;

class GiftFactory {
  final List<Gift> gifts;

  GiftFactory({
    this.gifts,
  });

  factory GiftFactory.fromJson(List<dynamic> parsedJson) {
    List<Gift> allgifts = new List<Gift>();
    allgifts = parsedJson.map((i) => Gift.fromJson(i)).toList();
    giftFactory = new GiftFactory(gifts: allgifts);
    return giftFactory;
  }
}

Future<String> _loadGiftAsset() async {
  return await rootBundle.loadString('jsons/gift.json');
}

Future loadGifts() async {
  String jsonCards = await _loadGiftAsset();
  final jsonResponse = json.decode(jsonCards);
  giftFactory = GiftFactory.fromJson(jsonResponse);
}

Future<List<Gift>> fetchGifts(String orgid) async {
  final response =
      await http.get(SERVER_API + "/getGiftByOrgId?orgId=" + orgid);
  // final response = await http.get("https://reqres.in/api/users?page=2");
  // print(response.body);

  if (response.statusCode == 200) {
    // If the call to the server was successful, parse the JSON.        
    return GiftFactory.fromJson(json.decode(response.body)).gifts;
  } else {
    // If that call was not successful, throw an error.
    throw Exception('Failed to load gifts');
  }
}
