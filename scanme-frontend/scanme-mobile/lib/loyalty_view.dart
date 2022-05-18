import 'package:WEtrustScanner/loyalty_details.dart';
import 'package:WEtrustScanner/models/loyalty.dart';
import 'package:WEtrustScanner/models/loyalty_factory.dart';
import 'package:flutter/material.dart';
import 'constants.dart';
import 'loyalty_card.dart';
import 'package:WEtrustScanner/users.dart';

class LoyaltyView extends StatefulWidget {
  @override
  _LoyaltyViewState createState() => _LoyaltyViewState();
}

class _LoyaltyViewState extends State<LoyaltyView> {
  List<Loyalty> cards;
  Future<List<Loyalty>> futurecards;

  @override
  void initState() {
    super.initState();
    if (isHardCodedData) {
      cards = loyaltyCardFactory.loyaltycards;
    } else {
      futurecards = fetchLoyaltyCards(mainuser.userId);
    }
  }

  @override
  build(BuildContext context) {
    if (isHardCodedData) {
      return CustomScrollView(
          semanticChildCount: cards.length,
          slivers: <Widget>[
            buildLoyaltyCards(cards, context),
          ]);
    } else {
      return FutureBuilder<List<Loyalty>>(
          future: futurecards,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              return CustomScrollView(
                  semanticChildCount: snapshot.data.length,
                  slivers: <Widget>[
                    buildLoyaltyCards(snapshot.data, context),
                  ]);
            }
            return CircularProgressIndicator();
          });
    }
  }

  Widget buildLoyaltyCards(List<Loyalty> cards, BuildContext context) {
    final EdgeInsets mediaPadding = MediaQuery.of(context).padding;
    final EdgeInsets padding = EdgeInsets.only(
        top: 8.0,
        left: 8.0 + mediaPadding.left,
        right: 8.0 + mediaPadding.right,
        bottom: 8.0);
    return SliverPadding(
      padding: padding,
      sliver: SliverGrid(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 1,
          crossAxisSpacing: 8.0,
          mainAxisSpacing: 8.0,
        ),
        delegate: SliverChildBuilderDelegate(
          (BuildContext context, int index) {
            final Loyalty card = cards[index];
            return LoyaltyCard(
              card: card,
              isGiftAvailable: true,
              onTap: () {
                Navigator.of(context).push(new MaterialPageRoute<Null>(
                    builder: (BuildContext context) {
                  return new LoyaltyDetails(card: card);
                }));
              },
            );
          },
          childCount: cards.length,
        ),
      ),
    );
  }
}
