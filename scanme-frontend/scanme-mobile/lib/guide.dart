import 'package:flutter/material.dart';

class Guide extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      body: new Container(
        child: Image.asset('images/guide1.jpg', fit:BoxFit.cover),            
      ),
      backgroundColor: Colors.white,
    );
  }
}

