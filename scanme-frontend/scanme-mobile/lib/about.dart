import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class About extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
          child: ListView(children: <Widget>[
        Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            Padding(padding: EdgeInsets.all(15),),
            CircleAvatar(
                radius: 50,
                backgroundImage: AssetImage(
                  'images/scanme.png',
                )),
            Padding(padding: EdgeInsets.all(10),),

            Text(
              "A platform for manufactures and consumers",
              style: TextStyle(color: Colors.blue),
            ),
            Text(
              " to collect, record and trace product integrity.",
              style: TextStyle(color: Colors.blue),
            ),
            Padding(
              padding: EdgeInsets.all(10),
            ),
            Text(
              'ScanME được phát triển với mục đích,',
            ),
            Text('là cầu nối thông tin giữa'),
            Text('nhà sản xuất và người mua'),
            Text('nhằm đưa thông tin minh bạch'),
            Text('về nguồn gốc sản phẩm.'),
            Padding(
              padding: EdgeInsets.all(15),
            ),
            Text(
              'Hi vọng chúng tôi tạo được một cầu nối tin cậy,',
              style: TextStyle(color: Colors.blue),
            ),
            Text(
              'giữa nhà sản xuất và người mua.',
              style: TextStyle(color: Colors.blue),
            ),
            Padding(
              padding: EdgeInsets.all(15),
            ),
            new MaterialButton(
                minWidth: 70.0,
                onPressed: _launchApp,
                color: Colors.blue,
                child: Row(mainAxisSize: MainAxisSize.min, children: <Widget>[
                  Icon(
                    Icons.add_comment,
                    color: Colors.white,
                  ),
                  new Text('  Đánh giá ứng dụng',
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16.0,
                          fontWeight: FontWeight.w300)),
                ])),
          ],
        )
      ])),
    );
  }

  void _launchApp() async {
    String appurl =
        'https://play.google.com/store/apps/details?id=com.teee.wetrust';

    if (await canLaunch(appurl)) {
      await launch(appurl);
    } else {}
  }
}
