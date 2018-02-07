import { Item } from './item';
import { Province } from './province';
export class Property{
    propertyId:number;
	propertyTotalArea:string;
	propertyDuildedArea:string;
    propertyYear:string;
	propertyAmenities:Object[];
	propertyAmbient:Object[];
	yng_Item:Item=new Item();
}