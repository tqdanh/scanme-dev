import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

abstract class BaseAuth {
  Future<FirebaseUser> signInWithGoogle(
      GoogleSignInAccount googleSignInAccount);

  Future<UserInfo> signInWithFacebook(String accessToken);

  Future<FirebaseUser> getCurrentUser();

  Future<void> signOut();
}

class Auth implements BaseAuth {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;

  Future<FirebaseUser> signInWithGoogle(
      GoogleSignInAccount googleSignInAccount) async {
    GoogleSignInAuthentication googleAuth =
        await googleSignInAccount.authentication;
    print(googleAuth.accessToken);

    final AuthCredential credential = GoogleAuthProvider.getCredential(
      accessToken: googleAuth.accessToken,
      idToken: googleAuth.idToken,
    );

    final FirebaseUser user =
        (await _firebaseAuth.signInWithCredential(credential)).user;
    print("signed in " + user.displayName);
    return user;
  }

  Future<UserInfo> signInWithFacebook(String accessToken) async {
    final AuthCredential credential = FacebookAuthProvider.getCredential(
      accessToken: accessToken,
    );
    final FirebaseUser user =
        (await _firebaseAuth.signInWithCredential(credential)).user;

    List<UserInfo> infos = user.providerData;
    UserInfo userInfo;
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

    final FirebaseUser currentUser = await _firebaseAuth.currentUser();
    assert(user.uid == currentUser.uid);
    return userInfo;
  }

  Future<FirebaseUser> getCurrentUser() async {
    FirebaseUser user = await _firebaseAuth.currentUser();
    return user;
  }

  Future<void> signOut() async {
    return _firebaseAuth.signOut();
  }
}
