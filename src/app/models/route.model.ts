import { RouteWaypointModel } from './route.waypoint.model';
import { RouteDataModel } from './route.route.model';

export interface RouteModel {
    geocoded_waypoints: RouteWaypointModel[];
    routes:             RouteDataModel[];
    status:             string;
}