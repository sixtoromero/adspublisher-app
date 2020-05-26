import { RouteBoundsModel } from './route.bounds.model';
import { RoutePolylineModel } from './route.polyline.model';
import { RouteLegModel } from './route.leg.model';

export interface RouteDataModel {
    bounds:            RouteBoundsModel;
    copyrights:        string;
    legs:              RouteLegModel[];
    overview_polyline: RoutePolylineModel;
    summary:           string;
    warnings:          any[];
    waypoint_order:    any[];
}