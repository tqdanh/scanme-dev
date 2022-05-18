import 'package:WEtrustScanner/models/loyalty.dart';
import 'package:WEtrustScanner/users.dart';
import 'package:flutter/material.dart';
import 'fancycard.dart';
import 'package:flip_card/flip_card.dart';
import 'package:qr_flutter/qr_flutter.dart';

class LoyaltyCard extends StatelessWidget {
  const LoyaltyCard(
      {Key key, this.card, this.isGiftAvailable = false, this.onTap})
      : super(key: key);
  final Loyalty card;
  final bool isGiftAvailable;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    Widget carddata = buildCardInformation();
    return GestureDetector(
        onTap: onTap,
        child: Card(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Container(
                  height: 180,
                  child: FlipCard(
                      onFlip: () {},
                      direction: FlipDirection.HORIZONTAL, // default
                      front: FancyCard(
                        data: carddata,
                      ),
                      back: Container(
                        width: MediaQuery.of(context).size.width,
                        color: Colors.white,
                        child: Center(
                            child: QrImage(
                          data: card.company.name +
                              "." +
                              mainuser.userId +
                              "." +
                              mainuser.email,
                          version: QrVersions.auto,
                          size: 200,
                          gapless: false,
                        )),
                      ))),
              Padding(
                padding: EdgeInsets.all(5),
              ),
              Row(
                children: <Widget>[
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: CircleAvatar(
                        radius: 30,
                        backgroundColor: Colors.white,
                        backgroundImage:
                            AssetImage("images/" + card.company.logo)),
                  ),
                  Expanded(
                      child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      Text(card.company.name,
                          style: TextStyle(fontSize: 22),
                          softWrap: true,
                          overflow: TextOverflow.ellipsis),
                      Text(card.company.address,
                          softWrap: true, overflow: TextOverflow.ellipsis),
                      Text(
                        card.company.tel,
                      ),
                      Text(
                        card.company.email,
                      ),
                    ],
                  )),
                ],
              ),
              Padding(
                padding: EdgeInsets.all(5),
              ),
              isGiftAvailable
                  ? Row(
                      children: <Widget>[
                        Padding(
                            padding: const EdgeInsets.fromLTRB(45.0, 0, 15, 0),
                            child: Icon(
                              Icons.card_giftcard,
                              size: 30,
                              color: Colors.teal,
                            )),
                        Text(
                          "Bạn có quà tặng! Tìm hiểu...",
                          style: TextStyle(color: Colors.teal),
                        )
                      ],
                    )
                  : Container()
            ],
          ),
        ));
  }

  Widget buildCardInformation() {
    return Center(
        child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
          Text(card.owner,
              style: TextStyle(
                color: Colors.greenAccent,
                fontSize: 25,
                fontWeight: FontWeight.w300,
                shadows: [
                  Shadow(
                    blurRadius: 10.0,
                    color: Colors.black,
                    offset: Offset(3.0, 3.0),
                  ),
                ],
              )),
          Padding(
            padding: EdgeInsets.all(10),
          ),
          RichText(
              text: TextSpan(
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w300),
                  children: [
                TextSpan(
                  text: 'THÀNH VIÊN ',
                ),
                TextSpan(
                    text: card.printCardType(),
                    style: TextStyle(
                        fontWeight: FontWeight.w500,
                        color: card.type == 1
                            ? Colors.teal
                            : (card.type == 2 ? Colors.cyan : Colors.yellow))),
              ])),
          RichText(
              text: TextSpan(
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w300),
                  children: [
                TextSpan(
                  text: 'ĐIỂM TÍCH LŨY:   ',
                ),
                TextSpan(
                    text: card.point.toString(),
                    style: TextStyle(fontWeight: FontWeight.w500)),
              ]))
        ]));
  }
}
