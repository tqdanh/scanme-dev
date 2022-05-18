import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'contact.dart';

class Hotline extends StatelessWidget {

  final double _appBarHeight = 256.0;

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: ThemeData(
        brightness: Brightness.light,
        primarySwatch: Colors.blue,
        platform: Theme.of(context).platform,
      ),
      child: Scaffold(
        body: CustomScrollView(
          slivers: <Widget>[
            SliverAppBar(
              expandedHeight: _appBarHeight,
              pinned: false,
              snap: false,            
              flexibleSpace: FlexibleSpaceBar(
                background: Stack(
                  fit: StackFit.expand,
                  children: <Widget>[
                    Image.asset( 'images/customerservices.jpg',
                      fit: BoxFit.cover,
                      height: _appBarHeight,
                    ),
                    const DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment(0.0, -1.0),
                          end: Alignment(0.0, -0.4),
                          colors: <Color>[Color(0x60000000), Color(0x00000000)],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SliverList(
              delegate: SliverChildListDelegate(<Widget>[
                AnnotatedRegion<SystemUiOverlayStyle>(
                  value: SystemUiOverlayStyle.dark,
                  child: ContactCategory(
                    icon: Icons.account_box,
                    children: <Widget>[
                      ContactItem(
                        onPressed: () {
                        },
                        lines: const <String>[
                          'Bộ phận bán hàng',
                          'ScanME sale teams',
                        ],
                      ),
                      ContactItem(
                        icon: Icons.call,
                        onPressed: () {
                        },
                        lines: const <String>[
                          '+84 901-029-254',
                          'Số di động',
                        ],
                      ),
                      ContactItem(
                        icon: Icons.email,
                        tooltip: 'Send message',
                        onPressed: () {
                        },
                        lines: const <String>[
                        'lckhanh@tma.com.vn',
                        'Email',
                        ],
                      ),
                    ],
                  ),
                ),
                ContactCategory(
                  icon: Icons.contact_mail,
                  children: <Widget>[
                      ContactItem(
                        onPressed: () {
                        },
                        lines: const <String>[
                          'Bộ phận chăm sóc khách hàng',
                          'ScanME customer services',
                        ],
                      ),
                    ContactItem(
                      icon: Icons.call,
                      tooltip: 'Send personal e-mail',
                      onPressed: () {
                      },
                      lines: const <String>[
                          '+ 84 918-029-254',
                          'Số di động',
                      ],
                    ),
                    ContactItem(
                      icon: Icons.email,
                      tooltip: 'Send work e-mail',
                      onPressed: () {
                      },
                      lines: const <String>[
                        'lckhanh@tma.com.vn',
                        'Email',
                      ],
                    ),
                  ],
                ),
              ]),
            ),
          ],
        ),
      ),
    );
  }
}



