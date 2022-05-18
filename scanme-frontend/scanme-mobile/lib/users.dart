import 'package:shared_preferences/shared_preferences.dart';

class User {
  String userId;
  String name;
  String email;
  String imagePath = "";
  int sso;
  String address;

  void loadUser() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    userId = (prefs.getString('userId') ?? null);
    name = (prefs.getString('name') ?? "");
    email = (prefs.getString('email') ?? "");
    imagePath = (prefs.getString('imagePath') ?? "");
    sso = (prefs.getInt('sso') ?? 0);
    address = (prefs.getString('address') ?? "");
  }

  void saveUser() async {
    // Store primitive data. when the user uninstalls your app, the data will also be deleted.
    SharedPreferences prefs = await SharedPreferences.getInstance();

    // prefs.setString('userId', userId);
    prefs.setString('name', name);
    prefs.setString('email', email);
    prefs.setString('imagePath', imagePath);
    prefs.setInt('sso', sso);
    prefs.setString('address', address);
  }

  void saveImagePath() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString('imagePath', imagePath);
  }

  void saveAddress() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString('address', address);
  }
}
// Global Variable
User mainuser = User();
