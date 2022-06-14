import 'package:scanme_mobile_temp/login.dart';
import 'package:scanme_mobile_temp/loyalty_details.dart';
import 'package:scanme_mobile_temp/models/loyalty.dart';
import 'package:scanme_mobile_temp/models/loyalty_factory.dart';
import 'package:scanme_mobile_temp/users.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:url_launcher/url_launcher.dart';
import 'models/company.dart';
import 'models/products.dart';
import 'product_map.dart';
import 'product_ingredient.dart';
import 'product_promotion.dart';
import 'product_ads.dart';
import 'styles.dart';
import 'constants.dart';

class ProductPage extends StatefulWidget {
  const ProductPage({Key? key, required this.product, required this.code})
      : super(key: key);

  final Product product;
  final String code;

  @override
  _ProductPageState createState() => _ProductPageState();
}

class _ProductPageState extends State<ProductPage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  final TextStyle menuItemStyle = const ProductStyle(
      fontSize: 15.0, color: Colors.black54, height: 24.0 / 15.0);

  double _getAppBarHeight(BuildContext context) =>
      MediaQuery.of(context).size.height * 0.3;

  Product _product = Product();

  @override
  void initState() {
    _product = this.widget.product;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final double appBarHeight = _getAppBarHeight(context);
    final Size screenSize = MediaQuery.of(context).size;
    final bool fullWidth = screenSize.width < kPageMaxWidth;

    return Scaffold(
      key: _scaffoldKey,
      body: Stack(
        children: <Widget>[
          Positioned(
            top: 0.0,
            left: 0.0,
            right: 0.0,
            height: appBarHeight + kHalfSize,
            child: Hero(
              tag: '${_product.code} package/${_product.image_ads}',
              child: Image.network(
                "${SERVER_API}/file/${_product.image_ads}",
                fit: BoxFit.cover,
              ),
            ),
          ),
          CustomScrollView(
            slivers: <Widget>[
              SliverAppBar(
                expandedHeight: appBarHeight - kHalfSize,
                backgroundColor: Colors.transparent,
                actions: <Widget>[
                  PopupMenuButton<String>(
                    onSelected: (String item) {},
                    itemBuilder: (BuildContext context) =>
                        <PopupMenuItem<String>>[
                      _buildMenuItem(Icons.share, 'Chia sẻ thông tin'),
                      _buildMenuItem(Icons.email, 'Email về sản phẩm'),
                      _buildMenuItem(Icons.message, 'Thông báo nhà xản suất'),
                    ],
                  ),
                ],
                flexibleSpace: const FlexibleSpaceBar(
                  background: DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment(0.0, -1.0),
                        end: Alignment(0.0, -0.2),
                        colors: <Color>[Color(0x60000000), Color(0x00000000)],
                      ),
                    ),
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Stack(
                  children: <Widget>[
                    Container(
                      padding: const EdgeInsets.only(top: kHalfSize),
                      width: fullWidth ? null : kPageMaxWidth,
                      child: ProductSheet(
                          product: widget.product, code: widget.code),
                    ),
                    Positioned(
                      right: 16.0,
                      child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            FloatingActionButton(
                              heroTag: "button_verified",
                              backgroundColor: widget.product.status ==
                                      PRODUCT_STATUS_BLOCKED
                                  ? Colors.red
                                  : Colors.blue,
                              child: Icon(
                                widget.product.status == PRODUCT_STATUS_BLOCKED
                                    ? Icons.warning
                                    : Icons.verified_user,
                                color: Colors.white,
                              ),
                              onPressed: () {
                                if (widget.product.status ==
                                    PRODUCT_STATUS_BLOCKED) {
                                  ScaffoldMessenger.maybeOf(context)!
                                      .showSnackBar(const SnackBar(
                                          content: Text(
                                    "CẢNH BÁO: \nNhà sản xuất có cảnh báo về mã sản phẩm bạn đang quét, xin cân nhắc trước khi mua, hoặc liên hệ với nhà sản xuất. ",
                                    style: TextStyle(
                                        color: Colors.red,
                                        fontWeight: FontWeight.w700),
                                  )));
                                }
                              },
                            ),
                          ]),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  PopupMenuItem<String> _buildMenuItem(IconData icon, String label) {
    return PopupMenuItem<String>(
      child: Row(
        children: <Widget>[
          Padding(
              padding: const EdgeInsets.only(right: 24.0),
              child: Icon(icon, color: Colors.black54)),
          Text(label, style: menuItemStyle),
        ],
      ),
    );
  }
}

class ProductSheet extends StatefulWidget {
  const ProductSheet({Key? key, required this.product, required this.code})
      : super(key: key);

  final Product product;
  final String code;

  @override
  _ProductSheetState createState() => _ProductSheetState();
}

class _ProductSheetState extends State<ProductSheet>
    with SingleTickerProviderStateMixin {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  late TabController _tabcontroller;

  final TextStyle titleStyle = const ProductStyle(fontSize: 25.0);
  final TextStyle descriptionStyle = const ProductStyle(
      fontSize: 15.0, color: Colors.black54, height: 20.0 / 15.0);
  final TextStyle errorStyle = const ProductStyle(
      fontSize: 15.0, color: Colors.red, height: 20.0 / 15.0);
  final TextStyle itemStyle =
      const ProductStyle(fontSize: 15.0, height: 24.0 / 15.0);
  final TextStyle itemAmountStyle = ProductStyle(
      fontSize: 15.0, color: kTheme.primaryColor, height: 24.0 / 15.0);
  final TextStyle headingStyle = const ProductStyle(
      fontSize: 16.0, fontWeight: FontWeight.bold, height: 24.0 / 15.0);
  final TextStyle alertStyle = const ProductStyle(
      fontSize: 15.0,
      color: Colors.red,
      fontWeight: FontWeight.w500,
      height: 16.0 / 15.0);

  Product product = Product();
  String code = '';

  @override
  void initState() {
    product = widget.product;
    code = widget.code;
    _tabcontroller = TabController(length: 4, vsync: this);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    String message = "Thông tin trên sản phẩm bạn đã quét " +
        (widget.product.status != PRODUCT_STATUS_BLOCKED ? "" : "KHÔNG ") +
        "được xác nhận từ nhà sản xuất" +
        (widget.product.status != PRODUCT_STATUS_BLOCKED
            ? ", với các thông tin chi tiết sau:"
            : ", xin cân nhắc trước khi mua.");

    return Material(
      child: SafeArea(
        top: false,
        bottom: false,
        child: Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 16.0, vertical: 40.0),
            child: Column(children: <Widget>[
              Table(
                  columnWidths: const <int, TableColumnWidth>{
                    0: FixedColumnWidth(64.0)
                  },
                  children: <TableRow>[
                    TableRow(children: <Widget>[
                      TableCell(
                          verticalAlignment: TableCellVerticalAlignment.middle,
                          child: Image.network(
                              SERVER_API +
                                  '/file/' +
                                  (product.image_unit ?? ''),
                              width: 40.0,
                              height: 80.0,
                              alignment: Alignment.centerLeft,
                              fit: BoxFit.scaleDown)),
                      TableCell(
                          verticalAlignment: TableCellVerticalAlignment.middle,
                          child: Text(product.name ?? '', style: titleStyle)),
                    ]),
                    TableRow(children: <Widget>[
                      const SizedBox(),
                      Padding(
                          padding: const EdgeInsets.only(top: 8.0, bottom: 4.0),
                          child: Text(product.introduction ?? '',
                              style: descriptionStyle)),
                    ]),
                  ]
                    ..add(
                      TableRow(children: <Widget>[
                        Padding(
                            padding: const EdgeInsets.symmetric(
                              vertical: 4.0,
                            ),
                            child: Align(
                                alignment: Alignment.centerLeft,
                                child: CircleAvatar(
                                  backgroundColor: widget.product.status ==
                                          PRODUCT_STATUS_BLOCKED
                                      ? Colors.red
                                      : Colors.blue,
                                  child: Icon(
                                    widget.product.status ==
                                            PRODUCT_STATUS_BLOCKED
                                        ? Icons.warning
                                        : Icons.verified_user,
                                    color: Colors.white,
                                  ),
                                ))),
                        Padding(
                            padding: const EdgeInsets.symmetric(vertical: 4.0),
                            child:
                                Text("Xác thực sản phẩm", style: headingStyle)),
                      ]),
                    )
                    ..add(TableRow(children: <Widget>[
                      const SizedBox(),
                      Padding(
                          padding: const EdgeInsets.all(0),
                          child: Text(message,
                              style: widget.product.status !=
                                      PRODUCT_STATUS_BLOCKED
                                  ? descriptionStyle
                                  : errorStyle)),
                    ]))
                    ..add((product.status != PRODUCT_STATUS_BLOCKED)
                        ? TableRow(children: <Widget>[
                            const SizedBox(),
                            Padding(
                                padding: const EdgeInsets.only(bottom: 4.0),
                                child: Text(
                                    "Ngày sản xuất: " +
                                        (product.mfg ?? '') +
                                        "\n"
                                            "Hạn sử dụng: " +
                                        (product.exp ?? '') +
                                        "\n"
                                            "LOT: " +
                                        (product.lot ?? ''),
                                    style: itemStyle)),
                          ])
                        : const TableRow(
                            children: <Widget>[SizedBox(), SizedBox()]))
                    ..add(
                      (product.actioncode == PRODUCT_ACTION_CODE_ADDPOINTS &&
                              product.point! > 0)
                          ? TableRow(children: <Widget>[
                              Padding(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 4.0,
                                  ),
                                  child: Align(
                                      alignment: Alignment.centerLeft,
                                      child: CircleAvatar(
                                        backgroundColor: Colors.teal,
                                        child: Icon(Icons.card_giftcard,
                                            color: Colors.white),
                                      ))),
                              Padding(
                                  padding:
                                      const EdgeInsets.symmetric(vertical: 4.0),
                                  child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.start,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      mainAxisSize: MainAxisSize.min,
                                      children: <Widget>[
                                        Text("Khách hàng thân thiết",
                                            style: headingStyle),
                                        Padding(
                                          padding: EdgeInsets.all(5),
                                        ),
                                        RichText(
                                            text: TextSpan(
                                                style: descriptionStyle,
                                                children: [
                                              TextSpan(
                                                text: "Bạn được ",
                                              ),
                                              TextSpan(
                                                  text: "  " +
                                                      product.point.toString() +
                                                      "  ",
                                                  style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      color: Colors.white,
                                                      backgroundColor:
                                                          Colors.teal)),
                                              TextSpan(
                                                text:
                                                    " điểm tích lũy từ chương trình khách hàng thân thiết.",
                                              ),
                                            ])),
                                        Padding(
                                          padding: EdgeInsets.all(2),
                                        ),
                                        MaterialButton(
                                          child: Text(
                                            mainuser.userId != null
                                                ? "Nhận điểm thưởng"
                                                : "Đăng nhập để nhận điểm thưởng",
                                            style:
                                                TextStyle(color: Colors.white),
                                          ),
                                          color: Colors.teal,
                                          onPressed: () {
                                            if (mainuser.userId != null) {
                                              handlePointSelected(
                                                  product.company!,
                                                  product.point!);
                                            } else {
                                              Navigator.push(
                                                  context,
                                                  MaterialPageRoute<void>(
                                                    settings:
                                                        const RouteSettings(
                                                            name: '/login'),
                                                    builder:
                                                        (BuildContext context) {
                                                      return Scaffold(
                                                          appBar: AppBar(
                                                            title: Text(
                                                                "Tài khoản"),
                                                          ),
                                                          body: Login());
                                                    },
                                                  ));
                                            }
                                          },
                                        ),
                                      ])),
                            ])
                          : TableRow(children: <Widget>[
                              const SizedBox(),
                              const SizedBox()
                            ]),
                    )),
              Padding(
                padding: EdgeInsets.all(10),
              ),
              Container(
                decoration: BoxDecoration(color: Colors.blue),
                child: TabBar(
                  controller: _tabcontroller,
                  isScrollable: true,
                  indicator: UnderlineTabIndicator(),
                  tabs: [
                    Tab(
                      icon: const Icon(Icons.home),
                      text: 'Truy xuất nguồn gốc',
                    ),
                    Tab(
                      icon: const Icon(Icons.room_service),
                      text: 'Thành phần dinh dưỡng',
                    ),
                    Tab(
                      icon: const Icon(Icons.card_giftcard),
                      text: 'Thông tin khuyến mãi',
                    ),
                    Tab(
                      icon: const Icon(Icons.store),
                      text: 'Sản phẩm khác',
                    ),
                  ],
                ),
              ),
              Container(
                height: 1680.0,
                child: TabBarView(
                  controller: _tabcontroller,
                  children: <Widget>[
                    ProductMap(
                      product: product,
                    ),
                    ProductIngredient(
                      product: product,
                    ),
                    ProductPromotion(
                      product: product,
                    ),
                    ProductAds(
                      product: product,
                    ),
                  ],
                ),
              ),
            ])),
      ),
    );
  }

  void handlePointSelected(Company company, int point) async {
    Loyalty card = Loyalty(
        id: '',
        owner: 'owner',
        cardnumber: 'cardnumber',
        type: 0,
        point: point,
        company: company);
    if (point > 0) {
      for (Loyalty c in loyaltyCardFactory.loyaltycards) {
        if (c.company.id == company.id) {
          c.point = c.point + point;
          card = c;
          break;
        }
      }
      setState(() {
        product.actioncode = PRODUCT_ACTION_CODE_VIEWINFOR;
        product.point = 0;
      });
    }

    bool accepted = await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text(
          'Khách hàng thân thiết',
          style: TextStyle(color: Colors.teal),
        ),
        content: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Text(('Bạn đã nhận được ' +
                  point.toString() +
                  ' điểm '
                      " từ công ty " +
                  company.name)),
            ]),
        actions: <Widget>[
          ElevatedButton(
              child: Text('XEM ĐIỂM TÍCH LŨY',
                  style: TextStyle(color: Colors.teal)),
              onPressed: () {
                Navigator.of(context).pop(true);
              }),
          ElevatedButton(
              child: Text('ĐÓNG', style: TextStyle(color: Colors.teal)),
              onPressed: () {
                Navigator.of(context).pop(false);
              }),
        ],
      ),
    );
    if (accepted) {
      // ignore: use_build_context_synchronously
      Navigator.push(
          context,
          MaterialPageRoute<void>(
            settings: const RouteSettings(name: '/loyalty/detail'),
            builder: (BuildContext context) {
              return LoyaltyDetails(card: card);
            },
          ));
    }
  }

  _launchURL() async {
    String url =
        'https://vinamilk.com.vn/sua-tuoi-vinamilk/vi/nhan-hang/sua-tuoi-tiet-trung/';

    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }
}
