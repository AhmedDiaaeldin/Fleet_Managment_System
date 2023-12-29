import 'dart:async';
import 'dart:math';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:auth_01/pages/mymap.dart';
import 'package:location/location.dart' as loc;
import 'package:permission_handler/permission_handler.dart';
import 'package:firebase_database/firebase_database.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;


int flag = 0;
String newDocName = 'notdefined';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final loc.Location _location = loc.Location();
  StreamSubscription<loc.LocationData>? _locationSubscription;
  late User? _currentUser;

  @override
  void initState() {
    super.initState();
    _initializeCurrentUser();
    _requestPermission();
  }

  Future<void> _initializeCurrentUser() async {
    final User? user = _auth.currentUser;
    if (user != null) {
      _currentUser = user;
    }
  }

  @override
  void dispose() {
    _locationSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Driver dashboard'),
      ),
      body: Column(
        children: [
          TextButton(
            onPressed: () {
              _startLiveTracking();
            },
            child: Text('Start Trip'),
          ),
          TextButton(
            onPressed: () {
              _stopLiveTracking();
            },
            child: Text('Finish Trip'),
          ),
          TextButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => MyMap(_currentUser!.uid),
                ),
              );
            },
            child: Text('Go to Map'),
          ),
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream:
                  FirebaseFirestore.instance.collection('location').snapshots(),
              builder: (context, snapshot) {
                if (!snapshot.hasData) {
                  return Center(child: CircularProgressIndicator());
                }
                return ListView.builder(
                  itemCount: snapshot.data!.docs.length,
                  itemBuilder: (context, index) {
                    final document = snapshot.data!.docs[index];
                    final email = document['email'] as String;
                    final latitude = document['latitude'] as double?;
                    final longitude = document['longitude'] as double?;

                    return ListTile(
                      title: Text(email),
                      subtitle: Row(
                        children: [
                          Text(latitude != null ? latitude.toString() : 'N/A'),
                          SizedBox(width: 20),
                          Text(
                              longitude != null ? longitude.toString() : 'N/A'),
                        ],
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _startLiveTracking() async {
    _locationSubscription =
        _location.onLocationChanged.listen((locationData) async {
      await _updateOrCreateTrip(locationData);
    });
  }

Future<void> _updateOrCreateTrip(loc.LocationData locationData) async {
  DatabaseReference dbRef = FirebaseDatabase.instance.ref('trip');

  Map<String, dynamic> tripPoint = {
    'latitude': locationData.latitude ?? 0.0,
    'longitude': locationData.longitude ?? 0.0,
    'timestamp': DateTime.now().millisecondsSinceEpoch,
  };

  if (flag == 0) {
    // Retrieve Driver Information from MongoDB
    var driverData = await findDriverByEmail(_currentUser!.email);
    String driverId = driverData?['_id'];
    String currBusId = driverData?['curr_bus_id'];

    DataSnapshot snapshot = await dbRef.get();
    if (snapshot.value == null) {
      newDocName = 'trip1';
    } else {
      final lastTripNumber = snapshot.children.last.key?.replaceFirst('trip', '');
      int lastNumber = int.tryParse(lastTripNumber ?? '0') ?? 0;
      newDocName = 'trip${lastNumber + 1}';
    }

    // Save the initial trip data with driver and bus information
    await dbRef.child(newDocName).set({
      'email': _currentUser!.email,
      'driver_id': driverId,
      'bus_id': currBusId,
      'trip_points': {
        '0': tripPoint,
      },
    });

    flag = 1;
  } else {
    // Add subsequent trip points
    await dbRef.child(newDocName).child('trip_points').push().set(tripPoint);
  }
}

Future<Map<String, dynamic>?> findDriverByEmail(String? email) async {
  try {
    var response = await http.get(Uri.parse('http://10.0.2.2:3000/api/drivers/email/$email'));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      // Handle the case where the server did not return a 200 OK response
      print('Failed to load driver details');
      return null;
    }
  } catch (e) {
    // Handle any exceptions
    print('Error: $e');
    return null;
  }
}

  void _stopLiveTracking() {
    _locationSubscription?.cancel();
    setState(() {
      _locationSubscription = null;
    });
    flag = 0;
    newDocName = 'notdefined';
  }

  void _requestPermission() async {
    var status = await Permission.location.request();
    if (status.isGranted) {
      print('Location permission granted.');
    } else if (status.isDenied) {
      _requestPermission();
    } else if (status.isPermanentlyDenied) {
      openAppSettings();
    }
  }
}
