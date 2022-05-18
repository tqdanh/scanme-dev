import 'package:WEtrustScanner/gift_view.dart';
import 'package:WEtrustScanner/models/gift.dart';
import 'package:WEtrustScanner/models/gift_factory.dart';
import 'package:WEtrustScanner/models/loyalty.dart';
import 'package:flutter/material.dart';
import 'package:flutter_swiper/flutter_swiper.dart';
import 'constants.dart';
import 'loyalty_card.dart';

class LoyaltyDetails extends StatefulWidget {
  const LoyaltyDetails({Key key, this.card}) : super(key: key);

  final Loyalty card;
  @override
  _LoyaltyDetailsState createState() => _LoyaltyDetailsState();
}

class _LoyaltyDetailsState extends State<LoyaltyDetails> {
  List<Gift> gifts = new List<Gift>();
  Future<List<Gift>> futuregifts;
  Gift selected;
  @override
  void initState() {
    gifts.addAll(giftFactory.gifts);
    gifts.removeWhere((g) => (g.point > widget.card.point));
    if (gifts.length > 0) selected = gifts[0];

    futuregifts = fetchGifts(widget.card.company.id);
    super.initState();
  }

  @override
  build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: Text("Tích lũy điểm")),
        body: Column(children: <Widget>[
          LoyaltyCard(
            card: widget.card,
            onTap: () {},
          ),
          Padding(
            padding: EdgeInsets.all(5),
          ),
          Text(
            "ĐỔI ĐIỂM LẤY QUÀ",
            style: TextStyle(
              fontSize: 20,
              color: Colors.teal,
            ),
          ),
          Padding(
            padding: EdgeInsets.all(8),
          ),
          Expanded(
              child: isHardCodedData
                  ? new Swiper(
                      onIndexChanged: (int index) {
                        setState(() {
                          selected = gifts[index];
                        });
                      },
                      onTap: (int index) {
                        setState(() {
                          selected = gifts[index];
                        });
                        handleGiftSelected(selected);
                      },
                      itemHeight: 300,
                      itemBuilder: (BuildContext context, int index) {
                        return Image.asset("images/" + gifts[index].image,
                            fit: BoxFit.fitHeight);
                      },
                      itemCount: gifts.length,
                      viewportFraction: 0.8,
                      scale: 0.9,
                    )
                  : FutureBuilder<List<Gift>>(
                      future: futuregifts,
                      builder: (context, snapshot) {
                        if (snapshot.hasData) {
                          return new Swiper(
                            onIndexChanged: (int index) {
                              setState(() {
                                selected = snapshot.data[index];
                              });
                            },
                            onTap: (int index) {
                              setState(() {
                                selected = snapshot.data[index];
                              });
                              handleGiftSelected(selected);
                            },
                            itemHeight: 300,
                            itemBuilder: (BuildContext context, int index) {
                              return Image.asset(
                                  "images/" + snapshot.data[index].image,
                                  fit: BoxFit.fitHeight);
                            },
                            itemCount: snapshot.data.length,
                            viewportFraction: 0.8,
                            scale: 0.9,
                          );
                        }
                        return CircularProgressIndicator();
                      })),
          Padding(
            padding: EdgeInsets.all(5),
          ),
          selected != null
              ? Text(
                  selected.name + " - " + selected.point.toString() + " điểm",
                  style: TextStyle(
                      color: Colors.teal,
                      fontSize: 17,
                      fontWeight: FontWeight.w300),
                )
              : Container(),
          Padding(
            padding: EdgeInsets.all(15),
          ),
          MaterialButton(
            child: Text(
              "XEM QUÀ TẶNG CỦA BẠN",
              style: TextStyle(color: Colors.white),
            ),
            color: Colors.teal,
            onPressed: () {
              Navigator.push(
                  context,
                  MaterialPageRoute<void>(
                    settings: const RouteSettings(name: '/gifts/details'),
                    builder: (BuildContext context) {
                      return Scaffold(
                          appBar: new AppBar(title: Text("Quà tặng của bạn")),
                          body: GiftView());
                    },
                  ));
            },
          ),
          Padding(
            padding: EdgeInsets.all(15),
          ),
        ]));
  }

  void handleGiftSelected(Gift gift) async {
    bool accepted = await showDialog(
      context: context,
      builder: (context) => new AlertDialog(
        title: new Text(
          'Xin xác nhận lại',
          style: TextStyle(color: Colors.teal),
        ),
        content: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Text(('Bạn đồng ý đổi ' +
                  gift.point.toString() +
                  " điểm lấy quà tặng?")),
              Expanded(child: Padding(
                  padding: EdgeInsets.fromLTRB(0, 10, 0, 10),
                  child: Image.asset("images/" + gift.image, fit: BoxFit.fill))),
              Text(gift.name),
            ]),
        actions: <Widget>[
          FlatButton(
              child: Text('KHÔNG', style: TextStyle(color: Colors.teal)),
              onPressed: () {
                Navigator.of(context).pop(false);
              }),
          Padding(
              padding: EdgeInsets.fromLTRB(0, 0, 10, 0),
              child: FlatButton(
                  child: Text('ĐỒNG Ý', style: TextStyle(color: Colors.teal)),
                  onPressed: () {
                    Navigator.of(context).pop(true);
                  })),
        ],
      ),
    );
    if (accepted) {}
  }
}
