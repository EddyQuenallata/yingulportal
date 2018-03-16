import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Network } from '../model/Network';
@Injectable()
export class IndexService {

  constructor(private http:Http) { }
  getItems() {
    let url = Network.API_URL+"index/item/all";
    return this.http.get(url);
  }
  getProduct() {
    let url = Network.API_URL+"item/product/all";
    return this.http.get(url);
  }
}
