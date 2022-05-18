class LocationActivity {
  LocationActivity({
    this.time,
    this.activity,
    this.content,
    this.sources,
    this.transactionId // Add code to get transaction
  });

  final String time;
  final String activity;
  final List<String> content;
  final List<Object> sources;
  final String transactionId; // Add code to get transaction
  bool isExpanded = false;

  factory LocationActivity.fromJson(Map<String, dynamic> parsedJson) {
    return LocationActivity(
      time: parsedJson['time'],
      activity: parsedJson['activity'],
      content: parsedJson['content'].cast<String>(),
      sources: parsedJson['sources'],
      transactionId: parsedJson['transactionId']
    );
  }
}
