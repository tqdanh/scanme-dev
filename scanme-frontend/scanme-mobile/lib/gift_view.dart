import 'package:flutter/material.dart';
import 'package:scanme_mobile_temp/models/gift_factory.dart';
import 'constants.dart';
import 'models/gift.dart';

class GiftView extends StatefulWidget {
  @override
  _GiftViewState createState() => _GiftViewState();
}

class _GiftViewState extends State<GiftView> {
  List<Gift> gifts = <Gift>[];
  late Future<List<Gift>> futuregifts;

  @override
  void initState() {
    super.initState();

    if (isHardCodedData) {
      gifts = giftFactory.gifts;
    } else {
      futuregifts = fetchGifts("06b6ced1fc354591881d317539cd7bc4");
    }
  }

  @override
  build(BuildContext context) {
    return buildGifts(context);
  }

  Widget buildGifts(BuildContext context) {
    if (isHardCodedData) {
      return ListView.builder(
          itemCount: gifts.length,
          itemBuilder: (BuildContext context, int index) {
            Gift item = gifts[index];
            return ListTile(
              leading: CircleAvatar(
                  radius: 25,
                  backgroundColor: Colors.white,
                  backgroundImage: AssetImage("images/" + item.image)),
              trailing: Padding(
                  padding: EdgeInsets.fromLTRB(0, 0, 10, 0),
                  child:
                      Icon(Icons.local_shipping, size: 30, color: Colors.teal)),
              title: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    Padding(
                      padding: EdgeInsets.all(2),
                    ),
                    Text(
                      item.name,
                      style:
                          TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                    ),
                    Text(
                      "Số lượng: " + item.quantity.toString(),
                      style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w400,
                          color: Colors.black),
                    ),
                    Text(
                      "Ngày hết hạn: " + item.expirydate,
                      style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w400,
                          color: Colors.black),
                    ),
                    Text(
                      "Công ty: " + item.company.name,
                      style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w400,
                          color: Colors.black),
                    ),
                    Text(
                      "Địa chỉ nhận hàng: " + item.company.address,
                      style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w400,
                          color: Colors.black),
                    ),
                  ]),
              contentPadding: EdgeInsets.all(10),
            );
          });
    } else {
      return FutureBuilder<List<Gift>>(
          future: futuregifts,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              return ListView.builder(
                  itemCount: snapshot.data?.length,
                  itemBuilder: (BuildContext context, int index) {
                    Gift item = snapshot.data![index];
                    return ListTile(
                      leading: CircleAvatar(
                          radius: 25,
                          backgroundColor: Colors.white,
                          backgroundImage: AssetImage("images/" + item.image)),
                      trailing: Padding(
                          padding: EdgeInsets.fromLTRB(0, 0, 10, 0),
                          child: Icon(Icons.local_shipping,
                              size: 30, color: Colors.teal)),
                      title: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            Padding(
                              padding: EdgeInsets.all(2),
                            ),
                            Text(
                              item.name,
                              style: TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.w500),
                            ),
                            Text(
                              "Số lượng: " + item.quantity.toString(),
                              style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w400,
                                  color: Colors.black),
                            ),
                            Text(
                              "Ngày hết hạn: " + item.expirydate,
                              style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w400,
                                  color: Colors.black),
                            ),
                            Text(
                              "Công ty: " + item.company.name,
                              style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w400,
                                  color: Colors.black),
                            ),
                            Text(
                              "Địa chỉ nhận hàng: " + item.company.address,
                              style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w400,
                                  color: Colors.black),
                            ),
                          ]),
                      contentPadding: EdgeInsets.all(10),
                    );
                  });
            }
            return CircularProgressIndicator();
          });
    }
  }
}
