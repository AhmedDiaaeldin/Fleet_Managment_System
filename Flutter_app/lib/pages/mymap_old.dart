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
  late GoogleMapController _controller;
  Set<Marker> _markers = {};
  Random _random = Random(); // To generate random hues

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder(
        stream: FirebaseFirestore.instance.collection('location').snapshots(),
        builder: (context, AsyncSnapshot<QuerySnapshot> snapshot) {
          if (!snapshot.hasData) {
            return Center(child: CircularProgressIndicator());
          }

          // Clear markers and add new ones for each user
          _markers.clear();
          double minLat = double.infinity, minLon = double.infinity;
          double maxLat = double.negativeInfinity, maxLon = double.negativeInfinity;

          for (var document in snapshot.data!.docs) {
          double lat = document['latitude'];
          double lon = document['longitude'];
          double color = document['color'];

          final marker = Marker(
            markerId: MarkerId(document.id),
            position: LatLng(lat, lon),
            infoWindow: InfoWindow(
              title: document['email'],
            ),
            icon: BitmapDescriptor.defaultMarkerWithHue(color), // Use color from Firestore
          );
          _markers.add(marker);

            // Calculate the min and max latitudes and longitudes
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
            if (lon < minLon) minLon = lon;
            if (lon > maxLon) maxLon = lon;
          }

          return GoogleMap(
            mapType: MapType.normal,
            markers: _markers,
            initialCameraPosition: CameraPosition(
              target: LatLng(0, 0),
              zoom: 14.47,
            ),
            onMapCreated: (GoogleMapController controller) {
              _controller = controller;

              // Delay camera update
              Future.delayed(Duration(seconds: 1), () async {
                LatLngBounds bounds = LatLngBounds(
                  southwest: LatLng(minLat, minLon),
                  northeast: LatLng(maxLat, maxLon),
                );

                await _controller.moveCamera(CameraUpdate.newLatLngBounds(bounds, 50));
              });
            },
          );
        },
      ),
    );
  }
}