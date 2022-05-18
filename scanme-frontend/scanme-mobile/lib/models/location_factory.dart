import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'location_activity.dart';

LocationActivityFactory locationActivityFactory;

class LocationActivityFactory {
  final List<LocationActivity> activities;

  LocationActivityFactory({
    this.activities,
  });

  factory LocationActivityFactory.fromJson(List<dynamic> parsedJson) {
    List<LocationActivity> acts = new List<LocationActivity>();
    acts = parsedJson.map((i) => LocationActivity.fromJson(i)).toList();
    return new LocationActivityFactory(activities: acts);
  }
}

Future<String> _loadLocationActivityAsset() async {
  return await rootBundle.loadString('jsons/location.json');
}

Future loadLocationActivities() async {
  String jsonActs = await _loadLocationActivityAsset();
  final jsonResponse = json.decode(jsonActs);
  locationActivityFactory = LocationActivityFactory.fromJson(jsonResponse);
}

Future<List<LocationActivity>> fetchLocationActivities() async {
  final response =
      await http.get('https://jsonplaceholder.typicode.com/posts/1');

  if (response.statusCode == 200) {
    // If the call to the server was successful, parse the JSON.
    return LocationActivityFactory.fromJson(json.decode(response.body))
        .activities;
  } else {
    // If that call was not successful, throw an error.
    throw Exception('Failed to load location activities');
  }
}
