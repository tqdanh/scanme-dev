import 'package:flutter/material.dart';
import 'dart:math';

import 'package:simple_animations/simple_animations.dart';

class FancyCard extends StatefulWidget {
  const FancyCard({required this.data, Key? key}) : super(key: key);
  final Widget data;

  @override
  _FancyCardState createState() => _FancyCardState();
}

class _FancyCardState extends State<FancyCard> {
  @override
  Widget build(BuildContext context) {
    return FancyBackgroundApp(
      data: widget.data,
    );
  }

  @override
  void dispose() {
    super.dispose();
  }
}

class FancyBackgroundApp extends StatelessWidget {
  const FancyBackgroundApp({required this.data, Key? key}) : super(key: key);
  final Widget data;
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: <Widget>[
        Positioned.fill(child: Container()),
        onBottom(AnimatedWave(
          height: 180,
          speed: 1.0,
        )),
        onBottom(AnimatedWave(
          height: 120,
          speed: 0.9,
          offset: pi,
        )),
        onBottom(AnimatedWave(
          height: 220,
          speed: 1.2,
          offset: pi / 2,
        )),
        Positioned.fill(child: CenteredText(data)),
      ],
    );
  }

  onBottom(Widget child) => Positioned.fill(
        child: Align(
          alignment: Alignment.bottomCenter,
          child: child,
        ),
      );
}

class AnimatedWave extends StatelessWidget {
  final double height;
  final double speed;
  final double offset;

  AnimatedWave({Key? key, required this.height,required  this.speed, this.offset = 0.0}): super(key: key);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) {
      return Container(
        height: height,
        width: constraints.biggest.width,
        child: PlayAnimation (
            duration: Duration(milliseconds: (5000 / speed).round()),
            tween: Tween(begin: 0.0, end: 2 * pi),
            builder: (context, child, value) {
              return CustomPaint(
                foregroundPainter: CurvePainter(value + offset),
              );
            }),
      );
    });
  }
}

class CurvePainter extends CustomPainter {
  final double value;

  CurvePainter(this.value);

  @override
  void paint(Canvas canvas, Size size) {
    final white = Paint()..color = Colors.white.withAlpha(60);
    final path = Path();

    final y1 = sin(value);
    final y2 = sin(value + pi / 2);
    final y3 = sin(value + pi);

    final startPointY = size.height * (0.5 + 0.4 * y1);
    final controlPointY = size.height * (0.5 + 0.4 * y2);
    final endPointY = size.height * (0.5 + 0.4 * y3);

    path.moveTo(size.width * 0, startPointY);
    path.quadraticBezierTo(
        size.width * 0.5, controlPointY, size.width, endPointY);
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();
    canvas.drawPath(path, white);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) {
    return true;
  }
}

// class AnimatedBackground extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     final tween = AnimatedBackground([
//       Track("color1").add(Duration(seconds: 3),
//           ColorTween(begin: Color(0xffD38312), end: Colors.teal)),
//       Track("color2").add(Duration(seconds: 3),
//           ColorTween(begin: Color(0xffA83279), end: Colors.teal[900]))
//     ]);

//     return PlayAnimation(
//       tween: tween,
//       duration: tween.duration,
//       builder: (context, child, List<Color> animation) {
//         return Container(
//           decoration: BoxDecoration(
//               gradient: LinearGradient(
//                   begin: Alignment.topCenter,
//                   end: Alignment.bottomCenter,
//                   colors: animation)),
//         );
//       },
//     );
//   }
// }

class CenteredText extends StatelessWidget {
  final Widget builder;

  const CenteredText(
    this.builder, {
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.fromLTRB(10, 0, 0, 0),
        child: Column(
            children: <Widget>[Expanded(child: Center(child: builder))]));
  }
}
