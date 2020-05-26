import { RouteDistanceModel } from './route.distance.model';
import { RouteNortheastModel } from './route.bounds.northeast.model';
import { RouteStepModel } from './route.step.model';

export interface RouteLegModel {
    distance:            RouteDistanceModel;
    duration:            RouteDistanceModel;
    end_address:         string;
    end_location:        RouteNortheastModel;
    start_address:       string;
    start_location:      RouteNortheastModel;
    steps:               RouteStepModel[];
    traffic_speed_entry: any[];
    via_waypoint:        any[];
}