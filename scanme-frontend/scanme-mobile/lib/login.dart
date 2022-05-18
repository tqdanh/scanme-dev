import 'dart:io';
import 'package:WEtrustScanner/constants.dart';
import 'package:WEtrustScanner/contact.dart';
import 'package:WEtrustScanner/users.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_facebook_login/flutter_facebook_login.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:url_launcher/url_launcher.dart';
import 'authentication.dart';
import 'package:image_picker/image_picker.dart';
import 'package:firebase_auth/firebase_auth.dart';

GoogleSignInAccount googleAccount;
FacebookLogin faceBookAccount;
FirebaseUser fireBaseAcoount;

class Login extends StatefulWidget {
  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final GoogleSignIn googleSignIn = new GoogleSignIn();
  File _image = null;

  @override
  Widget build(BuildContext context) {
    return mainuser.userId == null ? buildLoginPage() : buildUserInformation();
  }

  Widget buildLoginPage() {
    return Scaffold(
      body: Container(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: <Widget>[
              Padding(
                padding: EdgeInsets.all(20),
              ),
              Text("Xin hãy đăng nhập với tài khoản"),
              Text("Google hoặc Facebook."),
              Padding(
                padding: EdgeInsets.all(10),
              ),
              RaisedButton(
                  onPressed: () => signInWithGoogle(context: context),
                  padding: EdgeInsets.only(top: 3.0, bottom: 3.0, left: 3.0),
                  color: const Color(0xFFFFFFFF),
                  child: new Row(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      new Image.asset(
                        'images/google_button.jpg',
                        height: 40.0,
                      ),
                      new Container(
                          padding: EdgeInsets.only(left: 20.0, right: 20.0),
                          child: new Text(
                            "Đăng nhập với tài khoản Google",
                            style: TextStyle(fontWeight: FontWeight.normal),
                          ))
                    ],
                  )),
              Padding(
                padding: EdgeInsets.all(10),
              ),
              RaisedButton(
                  onPressed: () => signInWithFacebook(context: context),
                  padding: EdgeInsets.only(top: 3.0, bottom: 3.0, left: 3.0),
                  color: const Color(0xFFFFFFFF),
                  child: new Row(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      new Image.asset(
                        'images/facebook_logo.png',
                        height: 40.0,
                      ),
                      new Container(
                          padding: EdgeInsets.only(left: 10.0, right: 10.0),
                          child: new Text(
                            "Đăng nhập với tài khoản Facebook",
                            style: TextStyle(fontWeight: FontWeight.normal),
                          ))
                    ],
                  )),
            ],
          ),
        ),
      ),
    );
  }

  Widget buildUserInformation() {
    final double _appBarHeight = 256.0;
    try {
      if (mainuser.userId != null && mainuser.imagePath != '') {
        _image = File(mainuser.imagePath);
        if (!_image.existsSync()) _image = null;
      }
    } catch (e) {
      print(e.toString());
    }

    return Scaffold(
        body: CustomScrollView(slivers: <Widget>[
      SliverAppBar(
        expandedHeight: _appBarHeight,
        backgroundColor: Colors.white,
        pinned: false,
        snap: false,
        leading: Container(),
        flexibleSpace: GestureDetector(
            onTap: () {
              getProfileImage();
            },
            child: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: <Widget>[
                  _image == null
                      ? Image.asset(
                          'images/defaultusericon1.png',
                          fit: BoxFit.fitHeight,
                        )
                      : Image.file(
                          _image,
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
            )),
      ),
      SliverList(
        delegate: SliverChildListDelegate(
          <Widget>[
            AnnotatedRegion<SystemUiOverlayStyle>(
              value: SystemUiOverlayStyle.dark,
              child: ContactCategory(
                icon: Icons.contact_mail,
                children: <Widget>[
                  ContactItem(
                    onPressed: () {},
                    lines: <String>[
                      mainuser.name,
                      'Họ và Tên',
                    ],
                  ),
                  ContactItem(
                    icon: Icons.email,
                    tooltip: 'Send e-mail',
                    onPressed: () {
                      if (mainuser.email != null && mainuser.email.length > 0)
                        _launchEmail(mainuser.email);
                    },
                    lines: <String>[
                      mainuser.email,
                      'Email',
                    ],
                  ),
                  ContactItem(
                    icon: Icons.edit,
                    tooltip: 'Địa Chỉ',
                    onPressed: updateAddress,
                    lines: <String>[
                      mainuser.address != null ? mainuser.address : "",
                      'Địa Chỉ',
                    ],
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(vertical: 14.0),
              child: DefaultTextStyle(
                style: Theme.of(context).textTheme.subhead,
                child: SafeArea(
                  top: false,
                  bottom: false,
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Container(
                          padding: const EdgeInsets.symmetric(vertical: 7.0),
                          width: 72.0,
                          child: Icon(
                            Icons.input,
                            color: Colors.blue,
                          )),
                      Expanded(
                          child: Column(
                        children: <Widget>[
                          Align(
                              alignment: Alignment.centerLeft,
                              child: FlatButton(
                                color: Colors.blue,
                                child: Text(
                                  'Đăng xuất',
                                  style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w400),
                                ),
                                onPressed: () {
                                  // Sign out & update state
                                  _signOut();
                                },
                              )),
                        ],
                      ))
                    ],
                  ),
                ),
              ),
            )
          ],
        ),
      )
    ]));
  }

  Future<Null> signInWithGoogle({BuildContext context}) async {
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

  Future<Null> signInWithFacebook({BuildContext context}) async {
    Auth auth = Auth();

    try {
      FacebookLogin facebookLogin = new FacebookLogin();
      FacebookLoginResult result = await facebookLogin
          .logIn(['email', 'public_profile']).catchError((onError) {
        print("Error: $onError");
      });
      faceBookAccount = facebookLogin;
      switch (result.status) {
        case FacebookLoginStatus.loggedIn:
          try {
            auth.signInWithFacebook(result.accessToken.token).then((uid) {
              auth.getCurrentUser().then((firebaseUser) {
                fireBaseAcoount = firebaseUser;
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

  void _signOut() {
    Auth().signOut();
    if (mainuser.sso == SSO_GOOGLE) {
      googleSignIn.signOut();
      googleAccount = null;
    }

    if (mainuser.sso == SSO_FACEBOOK) {
      this.signOutFB();
    }

    setState(() {
      mainuser.userId = null;
      mainuser.name = null;
      mainuser.email = null;
      mainuser.sso = 0;
    });

    mainuser.saveUser();
  }


  Future<void> signOutFB() async {
    faceBookAccount.logOut();
    fireBaseAcoount = null;
    faceBookAccount = null;
  }


  Future getProfileImage() async {
    var image = await ImagePicker.pickImage(source: ImageSource.gallery);
    setState(() {
      _image = image;
    });

    if (image != null && image.path != null) {
      mainuser.imagePath = image.path;
      mainuser.saveImagePath();
    }
  }

  void updateAddress() {
    final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
    String address = "";
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
              title: Text('Cập nhật địa chỉ'),
              content: Form(
                  key: _formKey,
                  child: Container(
                      width: 220,
                      child: TextFormField(
                        initialValue: mainuser.address,
                        style: TextStyle(color: Colors.black),
                        textCapitalization: TextCapitalization.words,
                        decoration: InputDecoration(
                          hintStyle: TextStyle(color: Colors.white30),
                          labelStyle:
                              TextStyle(color: Colors.black45, fontSize: 14),
                          border: UnderlineInputBorder(),
                          filled: true,
                          hintText: 'Địa chỉ nơi nhận thư, quà tặng',
                          labelText: 'Địa chỉ *',
                          fillColor: Colors.white12,
                        ),
                        onSaved: (String value) {
                          print("SAVE" + address);
                          address = value;
                        },
                      ))),
              actions: <Widget>[
                FlatButton(
                    child: Text('HỦY', style: TextStyle(color: Colors.teal)),
                    onPressed: () {
                      Navigator.pop(context, false);
                    }),
                FlatButton(
                    child: Text('LƯU', style: TextStyle(color: Colors.teal)),
                    onPressed: () {
                      final FormState form = _formKey.currentState;
                      form.save();
                      if (address != "") {
                        setState(() {
                          mainuser.address = address;
                          mainuser.saveAddress();
                        });
                      }
                      Navigator.pop(context, true);
                    })
              ]);
        });
  }

  _launchEmail(String email) async {
    String emailaddress = 'mailto:$email';

    if (await canLaunch(emailaddress)) {
      await launch(emailaddress);
    } else {
      throw 'Could not launch $emailaddress';
    }
  }
}
