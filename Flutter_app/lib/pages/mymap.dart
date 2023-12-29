import 'dart:async';
import 'dart:math';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart' as loc;

class MyMap extends StatefulWidget {
  final String user_id;
  MyMap(this.user_id);
  @override
  _MyMapState createState() => _MyMapState();
}

class _MyMapState extends State<MyMap> {
  final loc.Location location = loc.Location();
  final Completer<GoogleMapController> _controllerCompleter =
      Completer<GoogleMapController>();

  Set<Marker> _markers = {};
  Set<Polyline> _polylines = {};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GoogleMap(
        onMapCreated: (GoogleMapController controller) {
          _controllerCompleter.complete(controller);
          _fetchTripAndDraw();
        },
        initialCameraPosition: CameraPosition(
          target: LatLng(0, 0), // Your initial position
          zoom: 15.0,
        ),
        polylines: _polylines,
      ),
    );
  }

  @override
  void initState() {
    super.initState();
  }

  void _fetchTripAndDraw() async {
    DocumentSnapshot documentSnapshot = await FirebaseFirestore.instance
        .collection('trip')
        .doc('trip5')
        .get();

    List<dynamic> tripPoints = documentSnapshot['trip_points'];

    // Convert your list of GeoPoints to LatLngs
    List<LatLng> latLngTripPoints = tripPoints.map((point) {
      return LatLng(point['latitude'], point['longitude']);
    }).toList();

    // Create a Polyline with those points
    Polyline polyline = Polyline(
      polylineId: PolylineId('trip'),
      color: Colors.red,
      points: latLngTripPoints,
    );

    // Add the polyline to the set
    setState(() {
      _polylines.add(polyline);
    });

    // Calculate bounds
    double southWestLatitude = latLngTripPoints[0].latitude;
    double southWestLongitude = latLngTripPoints[0].longitude;
    double northEastLatitude = latLngTripPoints[0].latitude;
    double northEastLongitude = latLngTripPoints[0].longitude;

    for (final point in latLngTripPoints) {
      if (point.latitude <= southWestLatitude)
        southWestLatitude = point.latitude;
      if (point.longitude <= southWestLongitude)
        southWestLongitude = point.longitude;
      if (point.latitude >= northEastLatitude)
        northEastLatitude = point.latitude;
      if (point.longitude >= northEastLongitude)
        northEastLongitude = point.longitude;
    }

    LatLng southWest = LatLng(southWestLatitude, southWestLongitude);
    LatLng northEast = LatLng(northEastLatitude, northEastLongitude);

    // Wait for the controller to be initialized
    GoogleMapController controller = await _controllerCompleter.future;

    // Now you can use the controller
    controller.animateCamera(
      CameraUpdate.newLatLngBounds(
          LatLngBounds(southwest: southWest, northeast: northEast), 50),
    );
  }
}