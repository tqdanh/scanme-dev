import 'dart:math';

import 'package:WEtrustScanner/constants.dart';
import 'package:WEtrustScanner/gift_view.dart';
import 'package:WEtrustScanner/loyalty_view.dart';
import 'package:WEtrustScanner/models/gift_factory.dart';
import 'package:WEtrustScanner/models/location_factory.dart';
import 'package:WEtrustScanner/users.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:barcode_scan/barcode_scan.dart';
import 'dart:async';
import 'package:flutter/services.dart';
import 'package:flutter_facebook_login/flutter_facebook_login.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'authentication.dart';
import 'models/loyalty_factory.dart';
import 'models/products.dart';
import 'product_list.dart';
import 'product_view.dart';
import 'guide.dart';
import 'settings.dart';
import 'help.dart';
import 'about.dart';
import 'hotline.dart';
import 'login.dart';

void main() async {
  // Call this method if you need the binding to be initialized before calling runApp
  WidgetsFlutterBinding.ensureInitialized();
  // Force the layout to Portrait mode
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  await mainuser.loadUser();
  await loadProducts();
  await loadLoyaltyCards();
  await loadGifts();
  await loadLocationActivities();

  runApp(MyApp());
}

enum DialogAction {
  cancel,
  discard,
  disagree,
  agree,
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ScanME Scanner',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'ScanME Scanner'),
      debugShowCheckedModeBanner: false,
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> with TickerProviderStateMixin {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  GoogleSignInAccount googleAccount;
  final GoogleSignIn googleSignIn = new GoogleSignIn();

  bool _autovalidate = false;

  String _appTitle = "ScanME Scanner";
  String barcode = "";
  String _inputcode = '';

  static final Animatable<Offset> _drawerDetailsTween = Tween<Offset>(
    begin: const Offset(0.0, -1.0),
    end: Offset.zero,
  ).chain(CurveTween(
    curve: Curves.fastOutSlowIn,
  ));

  AnimationController _controller;
  Animation<double> _drawerContentsOpacity;
  Animation<Offset> _drawerDetailsPosition;

  int _currentDrawerMenuIndex = 100;

  //all menu items
  List<String> _drawerContents = <String>[
    '0 Tài khoản',
    '1 Khách hàng thân thiết',
    '2 Quà tặng của bạn',
    '3 Kích hoạt & Bảo hành',
    '4 Lịch sử quét',
    '5 -',
    '6 Cấu hình',
    '7 Hướng dẫn sử dụng',
    '8 Hotline hỗ trợ',
    '9 Thông tin ứng dụng',
  ];

  List<Icon> _menuIcons = <Icon>[
    Icon(Icons.camera_roll),
    Icon(Icons.loyalty),
    Icon(Icons.card_giftcard),
    Icon(Icons.verified_user),
    Icon(Icons.person), // nothing
    Icon(Icons.settings),
    Icon(Icons.help),
    Icon(Icons.assignment_returned),
    Icon(Icons.phone),
    Icon(Icons.info),
    Icon(Icons.input),
  ];

  @override
  void initState() {
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );

    _drawerContentsOpacity = CurvedAnimation(
      parent: ReverseAnimation(_controller),
      curve: Curves.fastOutSlowIn,
    );

    _drawerDetailsPosition = _controller.drive(_drawerDetailsTween);
    if (mainuser.sso != null) {
      if (mainuser.sso == SSO_GOOGLE) {
        signInWithGoogle();
      } else if (mainuser.sso == SSO_FACEBOOK) {
        signInWithFacebook();
      }
    }
    super.initState();
  }

  Widget _buildBody() {
    switch (_currentDrawerMenuIndex) {
      case 0:
        return Login();
        break;
      case 1:
        if (mainuser.userId == null) return Login();
        return LoyaltyView();
        break;
      case 2:
        if (mainuser.userId == null) return Login();
        return GiftView();
        break;
      case 3:
        return Container();
        break;
      case 4:
        return ProductListView(context, myProducts.products).creatListView();
        break;
      case 6:
        return Settings();
        break;
      case 7:
        return Help();
        break;
      case 8:
        return Hotline();
        break;
      case 9:
        return About();
        break;
      default:
        return Guide();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return new WillPopScope(
        onWillPop: onWillPopScope,
        child: Scaffold(
          key: _scaffoldKey,
          appBar: AppBar(
            title: Text(_appTitle),
            leading: IconButton(
              icon: Icon(Icons.menu),
              alignment: Alignment.centerLeft,
              onPressed: () {
                _scaffoldKey.currentState.openDrawer();
              },
            ),
          ),
          drawer: Builder(builder: (context) => createDrawer()),
          floatingActionButtonLocation:
              FloatingActionButtonLocation.centerDocked,
          floatingActionButton: FloatingActionButton(
            child: const Icon(Icons.camera),
            onPressed: barcodeScanning,
          ),
          bottomNavigationBar: BottomAppBar(
            shape: CircularNotchedRectangle(),
            notchMargin: 4.0,
            child: new Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                IconButton(
                  icon: Icon(
                    Icons.menu,
                    color: Colors.white,
                  ),
                  onPressed: () {},
                ),
                IconButton(
                  icon: Icon(Icons.search),
                  onPressed: _enterProductCode,
                ),
              ],
            ),
          ),
          body: Center(child: _buildBody()),
        ));
  }

  Drawer createDrawer() {
    return Drawer(
      child: Column(
        children: <Widget>[
          GestureDetector(
            onTap: () {},
            child: UserAccountsDrawerHeader(
                accountName: Text("ScanME"),
                accountEmail: Text("A trusted platform to product integrity"),
                currentAccountPicture: const CircleAvatar(
                    backgroundImage: AssetImage(
                  'images/scanme.png',
                ))),
          ),
          MediaQuery.removePadding(
            context: context,
            // DrawerHeader consumes top MediaQuery padding.
            removeTop: true,
            child: Expanded(
              child: ListView(
                padding: const EdgeInsets.only(top: 8.0),
                children: <Widget>[
                  Stack(
                    children: <Widget>[
                      // The initial contents of the drawer.
                      FadeTransition(
                        opacity: _drawerContentsOpacity,
                        child: Column(
                            mainAxisSize: MainAxisSize.min,
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: _drawerContents.map<Widget>((String id) {
                              if (id.endsWith('-'))
                                return new Divider(color: Colors.grey);

                              return ListTile(
                                leading:
                                    _menuIcons[int.parse(id.substring(0, 2))],
                                title: Text(id.substring(2)),
                                onTap: () => _onMenuItemClick(
                                    int.parse(id.substring(0, 2))),
                              );
                            }).toList()),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _onMenuItemClick(int item) {
    Navigator.pop(context); // Dismiss the drawer.
    setState(() {
      _currentDrawerMenuIndex = item;
      _appTitle = _drawerContents[_currentDrawerMenuIndex].substring(2);
    });
  }

  Future barcodeScanning() async {
    try {
      String barcode = await BarcodeScanner.scan();
      setState(() => this.barcode = barcode);
      Product p;
      // HACK CODE for hard coded products
      if (this.barcode == "00CC5AD1AC2444369F0E0090F6925B2B" ||
          this.barcode == "69257FDFF3134A0C9AA1B185354F534F" ||
          this.barcode == "5E5DEAC3C29F4B17985C163A4A0F5E88" ||
          this.barcode == "123456" ||
          this.barcode == "10ABC123210001" ||
          this.barcode == "10ABC123210002" ||
          this.barcode == "00CC5AD1AC2444369F0E2674F6924231" ||
          this.barcode == "DCM0123456") {
        isHardCodedData = true;
        p = getProductFromCode(this.barcode);
      } else {
        isHardCodedData = false;
        p = await fetchProduct(barcode);

        for (int i = 0; i < myProducts.products.length; i++) {
          if (myProducts.products.elementAt(i).code == p.code) {
            myProducts.products.remove(myProducts.products.elementAt(i));
          }
        }

        myProducts.products.add(p);
      }

      if (p != null) {
        List<String> temps = barcode.split("currentTransId=");
        if (temps.length >= 2) barcode = temps[1];
        int countLocation = await countScanLocation(barcode);
        _scaffoldKey.currentState.showSnackBar(
          SnackBar(
            content: Text('This transaction Id is scanned: ' +
                countLocation.toString() +
                ' times'),
            backgroundColor: Colors.blue,
          ),
        );
        Navigator.of(context)
            .push(new MaterialPageRoute<Null>(builder: (BuildContext context) {
          return new ProductPage(product: p, code: this.barcode);
        }));
      } else {
        _scaffoldKey.currentState.showSnackBar(
          SnackBar(
            content: Text('Không tìm thấy mã sản phẩm: ' + this.barcode),
          ),
        );
      }
    } on PlatformException catch (e) {
      if (e.code == BarcodeScanner.CameraAccessDenied) {
        setState(() {
          this.barcode = 'No camera permission!';
        });
      } else {
        setState(() => this.barcode = 'Unknown error: $e');
      }
    } on FormatException {
      setState(() => this.barcode = 'Nothing captured.');
    } catch (e) {
      setState(() => this.barcode = 'Unknown error: $e');
    }
  }

  void _enterProductCode() {
    _inputcode = '';

    showDialog<DialogAction>(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
              title: const Text('Mã Sản Phẩm',
                  style: TextStyle(color: Colors.teal)),
              content: Form(
                  key: _formKey,
                  autovalidate: _autovalidate,
                  child: new Container(
                      width: 100,
                      child: TextFormField(
                        style: TextStyle(color: Colors.black),
                        textCapitalization: TextCapitalization.words,
                        decoration: const InputDecoration(
                          hintStyle: TextStyle(color: Colors.white30),
                          labelStyle:
                              TextStyle(color: Colors.black45, fontSize: 14),
                          border: UnderlineInputBorder(),
                          filled: true,
                          hintText: 'Nhập mã sản phẩm in trên bao bì',
                          labelText: 'Mã sản phẩm *',
                          fillColor: Colors.white12,
                        ),
                        onSaved: (String value) {
                          _inputcode = value;
                        },
                        validator: _validateCode,
                      ))),
              actions: <Widget>[
                FlatButton(
                    child:
                        const Text('HỦY', style: TextStyle(color: Colors.teal)),
                    onPressed: () {
                      _inputcode = "";
                      Navigator.pop(context, DialogAction.discard);
                    }),
                FlatButton(
                    child: const Text('ĐỒNG Ý',
                        style: TextStyle(color: Colors.teal)),
                    onPressed: () {
                      _saveProductCode();
                    })
              ]);
        });
  }

  void _saveProductCode() async {
    final FormState form = _formKey.currentState;
    if (!form.validate()) {
      _autovalidate = true; // Start validating on every change.
    } else {
      Navigator.pop(context, DialogAction.agree);
      form.save();

      if (_inputcode == null || _inputcode.length == 0) {
        return;
      }
      // setState(() => this.barcode = _inputcode); // For dev
      setState(() => this.barcode = '037fa997ee35abddd88d4e91c31103c396a8203281f90c5d6b63a5fb5b132524');
      // Product p = getProductFromCode(this.barcode); // For dev
      isHardCodedData = false; // For dev
      Product p = await fetchProduct(this.barcode); // For dev


      if (p != null) {
        Navigator.of(context)
            .push(new MaterialPageRoute<Null>(builder: (BuildContext context) {
          return new ProductPage(product: p, code: this.barcode);
        }));
      } else {
        _scaffoldKey.currentState.showSnackBar(
          SnackBar(
            content: Text('Không tìm thấy mã sản phẩm: ' + this.barcode),
          ),
        );
      }
    }
  }

  String _validateCode(String value) {
    if (value.isEmpty) return 'Xin nhập mã sản phẩm.';
    final RegExp nameExp = RegExp(r'^[A-Za-z0-9 ]+$');
    if (!nameExp.hasMatch(value))
      return 'Mã sản phẩm chỉ bao gồm các kí tự và số';

    return null;
  }

  Future<Null> signInWithGoogle() async {
    Auth auth = Auth();
    try {
      if (googleAccount == null) {
        googleAccount = await googleSignIn.signIn();
      }
      auth.signInWithGoogle(googleAccount).then((uid) {
        auth.getCurrentUser().then((firebaseUser) {
          List<UserInfo> infos = firebaseUser.providerData;
          UserInfo user;
          for (UserInfo ui in infos) {
            if (ui.providerId == "google.com") {
              user = ui;
              break;
            }
          }
          setState(() {
            mainuser.userId = user.uid;
            mainuser.name = user.displayName;
            mainuser.email = user.email;
            mainuser.sso = SSO_GOOGLE;
            mainuser.saveUser();
          });
        }).catchError((onError) {
          print("Error: $onError");
        });
      }).catchError((onError) {
        print("Error: $onError");
      });
    } catch (e) {
      print("Error in Google sign in: $e");
    }
  }

  Future<Null> signInWithFacebook() async {
    Auth auth = Auth();

    try {
      FacebookLogin facebookLogin = new FacebookLogin();
      FacebookLoginResult result = await facebookLogin
          .logIn(['email', 'public_profile']).catchError((onError) {
        print("Error: $onError");
      });
      switch (result.status) {
        case FacebookLoginStatus.loggedIn:
          try {
            auth.signInWithFacebook(result.accessToken.token).then((uid) {
              auth.getCurrentUser().then((firebaseUser) {
                List<UserInfo> infos = firebaseUser.providerData;
                UserInfo user;
                for (UserInfo ui in infos) {
                  if (ui.providerId == "facebook.com") {
                    user = ui;
                    break;
                  }
                }
                setState(() {
                  mainuser.userId = user.uid;
                  mainuser.name = user.displayName;
                  mainuser.email = user.email;
                  mainuser.sso = SSO_FACEBOOK;
                  mainuser.saveUser();
                });
              }).catchError((onError) {
                print("Error: $onError");
              });
            }).catchError((onError) {
              print("Error: $onError");
            });
          } catch (e) {
            print(e.toString());
          }
          break;
        case FacebookLoginStatus.cancelledByUser:
        case FacebookLoginStatus.error:
          print('Error: ' + result.errorMessage);
          break;
      }
    } catch (e) {
      print("Error in facebook sign in: $e");
    }
  }

  Future<bool> onWillPopScope() {
    return showDialog(
          context: context,
          builder: (context) => new AlertDialog(
            title: new Text('Xin xác nhận lại'),
            content: new Text('Bạn muốn đóng ứng dụng ScanME?'),
            actions: <Widget>[
              FlatButton(
                  child: Text('HỦY', style: TextStyle(color: Colors.teal)),
                  onPressed: () {
                    Navigator.of(context).pop(false);
                  }),
              Padding(
                  padding: EdgeInsets.fromLTRB(0, 0, 10, 0),
                  child: FlatButton(
                      child: Text('ĐÓNG', style: TextStyle(color: Colors.teal)),
                      onPressed: () {
                        Navigator.of(context).pop(true);
                      })),
            ],
          ),
        ) ??
        false;
  }
}
