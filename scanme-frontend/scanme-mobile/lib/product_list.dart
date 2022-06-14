import 'package:scanme_mobile_temp/constants.dart';
import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:collection/collection.dart' show lowerBound;
import 'product_view.dart';
import 'models/products.dart';

enum DialogAction {
  cancel,
  discard,
  disagree,
  agree,
}

class ProductListView {
  final List<LeaveBehindItem> _names = <LeaveBehindItem>[];
  late BuildContext _context;

  ProductListView(BuildContext context, List<Product> products) {
    products.forEach((p) => this._names.add(LeaveBehindItem(
        code: p.code ?? '', name: p.name ?? '', image: p.image_unit ?? '')));

    this._context = context;
  }

  Widget buildListTile(LeaveBehindItem item) {
    return _LeaveBehindListItem(
      item: item,
      onArchive: _handleArchive,
      onDelete: _handleDelete,
      onTap: _handleTapped,
    );
  }

  ListView creatListView() {
    Iterable<Widget> listTiles =
        _names.map<Widget>((LeaveBehindItem item) => buildListTile(item));

    return ListView(
      padding: EdgeInsets.symmetric(vertical: 8.0),
      children: listTiles.toList(),
    );
  }

  void handleUndo(LeaveBehindItem item) {
    final int insertionIndex = lowerBound(_names, item);
    Scaffold.of(_context).setState(() {
      _names.insert(insertionIndex, item);
    });
  }

  void _handleArchive(LeaveBehindItem item) {
    Scaffold.of(_context).setState(() {
      _names.remove(item);
    });
    ScaffoldMessenger.maybeOf(_context)!.showSnackBar(SnackBar(
        content: Text('You rejected item ${item.code}'),
        action: SnackBarAction(
            label: 'UNDO',
            onPressed: () {
              handleUndo(item);
            })));
  }

  void _handleTapped(LeaveBehindItem item) {
    // isHardCodedData = true;
    Navigator.push(
        _context,
        MaterialPageRoute<void>(
          settings: const RouteSettings(name: '/product/detail'),
          builder: (BuildContext context) {
            return ProductPage(product: getProductFromCode(item.code), code: '',);
          },
        ));
  }

  void _handleDelete(LeaveBehindItem item) {
    Scaffold.of(_context).setState(() {
      _names.remove(item);
    });
    ScaffoldMessenger.maybeOf(_context)!.showSnackBar(SnackBar(
        content: Text('You deleted item ${item.code}'),
        action: SnackBarAction(
            label: 'UNDO',
            onPressed: () {
              handleUndo(item);
            })));
  }
}

class LeaveBehindItem implements Comparable<LeaveBehindItem> {
  LeaveBehindItem(
      {required this.code, required this.name, required this.image});

  LeaveBehindItem.from(LeaveBehindItem item)
      : code = item.code,
        name = item.name,
        image = item.image;

  final String code;
  final String name;
  final String image;

  @override
  int compareTo(LeaveBehindItem other) => code.compareTo(other.code);
}

class _LeaveBehindListItem extends StatelessWidget {
  const _LeaveBehindListItem({
    Key? key,
    required this.item,
    required this.onArchive,
    required this.onDelete,
    required this.onTap,
  }) : super(key: key);

  final LeaveBehindItem item;
  final void Function(LeaveBehindItem) onArchive;
  final void Function(LeaveBehindItem) onDelete;
  final void Function(LeaveBehindItem) onTap;
  void _handleArchive() {
    onArchive(item);
  }

  void _handleDelete() {
    onDelete(item);
  }

  void _handleTapped() {
    onTap(item);
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    return Semantics(
      customSemanticsActions: <CustomSemanticsAction, VoidCallback>{
        const CustomSemanticsAction(label: 'Archive'): _handleArchive,
        const CustomSemanticsAction(label: 'Reject'): _handleDelete,
      },
      child: Dismissible(
        key: ObjectKey(item),
        direction: DismissDirection.horizontal,
        onDismissed: (DismissDirection direction) {
          if (direction == DismissDirection.endToStart)
            _handleArchive();
          else
            _handleDelete();
        },
        background: Container(
            color: theme.primaryColor,
            alignment: Alignment.center,
            child: const ListTile(
                title: Text('Delete',
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 16.0,
                        fontWeight: FontWeight.w300)),
                leading:
                    Icon(Icons.delete, color: Colors.redAccent, size: 36.0))),
        secondaryBackground: Container(
            color: theme.primaryColor,
            child: const ListTile(
                title: Align(
                    alignment: Alignment.centerRight,
                    child: Text('Reject',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 16.0,
                            fontWeight: FontWeight.w300))),
                trailing: Icon(Icons.remove_circle,
                    color: Colors.redAccent, size: 36.0))),
        child: Container(
          child: MergeSemantics(
              child: ListTile(
                  onTap: _handleTapped,
                  leading: ExcludeSemantics(
                      child: CircleAvatar(
                          radius: 25,
                          backgroundImage: AssetImage("images/${item.image}"))),
                  title: Text(item.name),
                  subtitle: Text(
                    item.code,
                    style: const TextStyle(fontSize: 12),
                  ),
                  isThreeLine: true)),
        ),
      ),
    );
  }
}
