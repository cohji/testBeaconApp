import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { IBeacon } from '@ionic-native/ibeacon';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  private uuid: string = 'B9407F30-F5F8-466E-AFF9-25556B57FE6D';

  constructor(public navCtrl: NavController,private localNotifications: LocalNotifications, private readonly platform: Platform, private readonly ibeacon: IBeacon) {

    this.platform.ready().then(async () => {
      console.log('async platform.ready()');
    });

    this.platform.ready().then(() => {
      console.log('platform.ready()');
    });
  }
    
  ngOnInit() {
    this.platform.ready().then(() => {
      console.log('ngOnInit');
      this.startBleFun();
    });
  }

  
  public startBleFun(): void {


    // Request permission to use location on iOS
    this.ibeacon.requestAlwaysAuthorization();
    // create a new delegate and register it with the native layer
    let delegate = this.ibeacon.Delegate();

    // Subscribe to some of the delegate's event handlers
    // delegate.didRangeBeaconsInRegion().subscribe(
    //   (pluginResult: IBeaconPluginResult) => console.log('didRangeBeaconsInRegion: ', pluginResult),
    //   (error: any) => console.error(`Failure during ranging: `, error)
    // );
    delegate.didStartMonitoringForRegion().subscribe(
      pluginResult => console.log('didStartMonitoringForRegion: ', pluginResult),
      (error: any) => console.error('Failure during starting of monitoring: ', error)
    );

    delegate.didEnterRegion().subscribe(
      pluginResult => {
        console.log('didEnterRegion: ', pluginResult);
        this.localNotifications.schedule({
          id: 1,
          title: "didEnterRegion",
          text: "pluginResult",
          trigger: {at: new Date(new Date().getTime() + (1 * 1000))}
        });
      }
    );

    console.log('Creating BeaconRegion with UUID of: ', this.uuid);
    const beaconRegion = this.ibeacon.BeaconRegion('nullBeaconRegion', this.uuid, 0, 0);

    this.ibeacon.startMonitoringForRegion(beaconRegion).then(
      () => console.log('Native layer recieved the request to monitoring'),
      (error: any) => console.error('Native layer failed to begin monitoring: ', error)
    );

    // this.ibeacon.startRangingBeaconsInRegion(beaconRegion)
    //   .then(() => {
    //     console.log(`Started ranging beacon region: `, beaconRegion);
    //   })
    //   .catch((error: any) => {
    //     console.error(`Failed to start ranging beacon region: `, beaconRegion);
    //   });
  }
}
