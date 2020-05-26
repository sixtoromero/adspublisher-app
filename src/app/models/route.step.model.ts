import { RoutePolylineModel } from './route.polyline.model';
import { RouteNortheastModel } from './route.bounds.northeast.model';
import { RouteDistanceModel } from './route.distance.model';

export interface RouteStepModel {
    distance:          RouteDistanceModel;
    duration:          RouteDistanceModel;
    end_location:      RouteNortheastModel;
    html_instructions: string;
    polyline:          RoutePolylineModel;
    start_location:    RouteNortheastModel;
    travel_mode:       string;
    maneuver?:         string;
}