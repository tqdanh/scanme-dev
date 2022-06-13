import 'package:flutter/material.dart';

class Settings extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      body: new Container(
        child: Center(
            child: Padding(
                padding: EdgeInsets.all(20),
                child: Text(
                  "",
                  style: TextStyle(color: Colors.blue, fontSize: 16),
                ))),
      ),
      backgroundColor: Colors.white,
    );
  }
}
