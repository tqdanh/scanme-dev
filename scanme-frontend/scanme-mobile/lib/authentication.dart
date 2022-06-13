import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

abstract class BaseAuth {
  Future<User?> signInWithGoogle(
      GoogleSignInAccount googleSignInAccount);

  Future<UserInfo?> signInWithFacebook(String accessToken);

  Future<User?> getCurrentUser();

  Future<void> signOut();
}

class Auth implements BaseAuth {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;

  @override
  Future<User?> signInWithGoogle(
      GoogleSignInAccount googleSignInAccount) async {
    GoogleSignInAuthentication googleAuth =
        await googleSignInAccount.authentication;
    print(googleAuth.accessToken);

    final AuthCredential credential = GoogleAuthProvider.credential(
      accessToken: googleAuth.accessToken,
      idToken: googleAuth.idToken,
    );

    User? user =
        (await _firebaseAuth.signInWithCredential(credential)).user;
    return user;
  }
  @override
  Future<UserInfo?> signInWithFacebook(String accessToken) async {
    final AuthCredential credential = FacebookAuthProvider.credential(accessToken);
    final User? user =
        (await _firebaseAuth.signInWithCredential(credential)).user;

    List<UserInfo> infos = user!.providerData;
    UserInfo userInfo = UserInfo({});
    for (UserInfo ui in infos) {
      if (ui.providerId == "facebook.com") {
        userInfo = ui;
        break;
      }
    }
    assert(userInfo.email != null);
    assert(userInfo.displayName != null);
    assert(!user.isAnonymous);
    assert(await user.getIdToken() != null);

    User? currentUser = _firebaseAuth.currentUser!;
    assert(user.uid == currentUser.uid);
    return userInfo;
  }

  @override
  Future<User?> getCurrentUser() async {
    User? user = _firebaseAuth.currentUser!;
    return user;
  }

  Future<void> signOut() async {
    return _firebaseAuth.signOut();
  }
}
