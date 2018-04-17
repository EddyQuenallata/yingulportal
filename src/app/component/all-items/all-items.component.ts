import { Component, OnInit } from '@angular/core';
import { user } from '../../model/user';
import { FavoriteService } from '../../service/favorite.service';
import { IndexService } from '../../service/index.service';
import { Item } from '../../model/item';
import { SellService } from '../../service/sell.service';
import { Category } from '../../model/category';
import { ListCategoryService } from '../../service/list-category.service';
import { Network } from '../../model/Network';
import { ItemService } from '../../service/item.service';

@Component({
  selector: 'app-all-items',
  templateUrl: './all-items.component.html',
  styleUrls: ['./all-items.component.css']
})
export class AllItemsComponent implements OnInit {
  BUCKET_URL:string=Network.BUCKET_URL;
  itemList: Item[]=[];
  itemListTemp: Item[]=[];
  countryCard:boolean=false;
  countryList: Object[];
  countryListFive:Object[];
  category:Category=new Category;
  subCategoryList: Category[];
  subCategoryListTemp:Category[];
  tensubCategoryList: Category[];
  itemFavorites: Item[]=[];
  User: user=new user();
  popup:boolean=true;
  popup3:boolean=true;
  popup4:boolean=true;
  popup5:boolean=true;
  popup6:boolean=true;
  popup7:boolean=true;
  popup8:boolean=true;
  popup9:boolean=true;
  popupFechaPubli:boolean=true;
  popupCond:boolean=true;
  today = new Date().toJSON().split('T')[0];
  dateDesde:string;
  dateHasta:string;
  provinceCard:boolean=true;
  provinceList: Object[];
  provinceListFive:Object[];
  cityCard:boolean=true;
  cityList: Object[];
  cityListFive:Object[];
  MediaPrice:number=0;
  priceTotal:number=0;
  minPrice:number=0;
  maxPrice:number=0;
  precioDesde:number;
  precioHasta:number;
  conditionCard:boolean=false;
  constructor(private favoriteService: FavoriteService,private itemService: ItemService,private sellService:SellService, private categoryService1: ListCategoryService) { }

  ngOnInit() {
    if(localStorage.getItem('user') == '' || localStorage.getItem('user') == null) {
      this.User = new user();
		} else {
      this.User=JSON.parse(localStorage.getItem("user"));
      this.getItemFavorite();
		}
    this.itemService.getItemsOver(false).subscribe(
			res => {
            this.itemList = JSON.parse(JSON.parse(JSON.stringify(res))._body);
            console.log(JSON.stringify(this.itemList));
            for(var j=0; j<this.itemList.length; j++){
              this.priceTotal=this.priceTotal+this.itemList[j].price;
            }
            this.MediaPrice=this.priceTotal/this.itemList.length;
            this.minPrice=this.MediaPrice-(this.MediaPrice*0.4);
            this.maxPrice=this.MediaPrice+(this.MediaPrice*0.4);
      		},
      		error => console.log(error)
    );

    this.sellService.getCountries().subscribe(
			res => {
            this.countryList = JSON.parse(JSON.parse(JSON.stringify(res))._body);
            this.countryListFive= JSON.parse(JSON.parse(JSON.stringify(res))._body);
            this.countryListFive=this.countryListFive.splice(0,5);
      		},
      		error => console.log(error)
    );
    this.subCategoryList=[];
    this.categoryService1.getCategories("Product/0").subscribe(
      res => {
            this.subCategoryList = JSON.parse(JSON.parse(JSON.stringify(res))._body);
            this.subCategoryListTemp= JSON.parse(JSON.parse(JSON.stringify(res))._body);
            if(this.subCategoryList.length>5){this.tensubCategoryList=this.subCategoryList.splice(0,5);}
            else{this.tensubCategoryList=this.subCategoryList;}
            if(JSON.stringify(this.subCategoryList)=="[]"){this.tensubCategoryList=null;}
          },
          error => console.log(error)
    );
  }
  getItemFavorite(){
    this.favoriteService.getItemFavorite(this.User.username).subscribe(
			res => {
            this.itemFavorites = JSON.parse(JSON.parse(JSON.stringify(res))._body);
      		},
      		error => console.log(error)
    );
  }
  popupHide(){
    this.popup=true;
    this.popup3=true;
    this.popup4=true;
    this.popup5=true;
    this.popup6=true;
    this.popup7=true;
    this.popup8=true;
    this.popup9=true;
    this.popupFechaPubli=true;
    this.popupCond=true;
  }
  filterHidden(){
    this.popup5=false;  
  }
  popupProvince(){
    this.popup3=false;
    this.popup5=true;
    this.popup8=true;
  }
  popupCity(){
    this.popup4=false;
    this.cityCard=true;
  }
  findPrice(precioDesde:number,precioHasta:number){
    this.itemListTemp=[];
    for (var i = 0; i < this.itemList.length; i++) {
      if(precioHasta==0){
        if(this.itemList[i].price>=precioDesde){
          this.itemListTemp.push(this.itemList[i]);
        }
      }else{
        if(this.itemList[i].price>=precioDesde && this.itemList[i].price<=precioHasta){
          this.itemListTemp.push(this.itemList[i]);
        }
      }
    }
    this.itemList=[];
    this.itemList=this.itemListTemp;
  }
  popupPrice(){
    this.popupHide();
    this.popup6=false;
  }
  popupCategorys(){
    this.popupHide();
    this.popup7=false;
  }
  popupDatePubli(){
    this.popupHide();
    this.popupFechaPubli=false;
  }
  popupCondition(){
    this.popupHide();
    this.popupCond=false;
  }
  popupCategory(){
    this.popup=false;
    this.popup7=true;
    this.popup5=true;
  }
  popupUbication(){
    this.popup8=false;
  }
  popupCountry(){
    this.popupHide();
    this.popup9=false;
  }
  findNew(){
    this.itemListTemp=[];
    for (let i of this.itemList) {
      if(i.condition=="New"){
        this.itemListTemp.push(i);
      }
    }
    this.itemList=[];
    this.itemList=this.itemListTemp;
    this.conditionCard=true;
  }
  findNew2(){
    this.findNew();
    this.popupHide();
  }
  findUsed(){
    this.itemListTemp=[];
    for (let i of this.itemList) {
      if(i.condition=="Used"){
        this.itemListTemp.push(i);
      }
    }
    this.itemList=[];
    this.itemList=this.itemListTemp;
    this.conditionCard=true;
  }
  findUsed2(){
    this.findUsed();
    this.popupHide();
  }
  isFavortite(itemId:number){
    for(let i of this.itemFavorites){
      if(i.itemId==itemId){
        return true;
      }
    }
  }
  findCountry(a:number){
    this.sellService.getProvinces(a).subscribe(
			res => {
            this.provinceList = JSON.parse(JSON.parse(JSON.stringify(res))._body);
            this.provinceListFive= JSON.parse(JSON.parse(JSON.stringify(res))._body);
            this.provinceListFive=this.provinceListFive.splice(0,5);
      		},
      		error => console.log(error)
    );
    this.itemListTemp=[];
    for (var i = 0; i < this.itemList.length; i++) {
      if(this.itemList[i].yng_Ubication.yng_Country.countryId==a){
        this.itemListTemp.push(this.itemList[i]);
      }
    }
    this.itemList=[];
    this.itemList=this.itemListTemp;
    this.popupHide();
    this.countryCard=true;
    this.provinceCard=false;
  }
  findProvince(a:number){
    this.sellService.getCities(a).subscribe(
			res => {
            this.cityList = JSON.parse(JSON.parse(JSON.stringify(res))._body);
            this.cityListFive= JSON.parse(JSON.parse(JSON.stringify(res))._body);
            this.cityListFive=this.cityListFive.splice(0,5);
      		},
      		error => console.log(error)
    );
    this.itemListTemp=[];
    for (var i = 0; i < this.itemList.length; i++) {
      alert(this.itemList[i].yng_Ubication.yng_Province.provinceId)
      if(this.itemList[i].yng_Ubication.yng_Province.provinceId==a){
        this.itemListTemp.push(this.itemList[i]);
      }
    }
    this.itemList=[];
    this.itemList=this.itemListTemp;
    this.popupHide();
    this.provinceCard=true;
    this.cityCard=false;
  }
  findCity(b:number){
    this.itemListTemp=[];
    for (var i = 0; i < this.itemList.length; i++) {
      if(this.itemList[i].yng_Ubication.yng_City.cityId==b){
        this.itemListTemp.push(this.itemList[i]);
      }
    }
    this.itemList=[];
    this.itemList=this.itemListTemp;
    this.popupHide();
    this.provinceCard=true;
    this.cityCard=true;
  }
  findDate(){
    let dateDesde;
    let dateHasta;
    if(this.dateDesde==null){
      dateDesde=["2018","03","08"];
    }else{
      dateDesde=this.dateDesde.split("-");
    }
    if(this.dateHasta==null){
      dateHasta=this.today.split("-");
    }else{
      dateHasta=this.dateHasta.split("-");
    }
    
    this.itemListTemp=[];
    for (var i = 0; i < this.itemList.length; i++) {
      if(this.itemList[i].yearPublication>=+dateDesde[0]&&this.itemList[i].yearPublication<=+dateHasta[0]&&this.itemList[i].monthPublication>=+dateDesde[1]&&this.itemList[i].monthPublication<=+dateHasta[1]&&this.itemList[i].dayPublication>=+dateDesde[2]&&this.itemList[i].dayPublication<=+dateHasta[2]){
        this.itemListTemp.push(this.itemList[i]);
      }
    }
    this.itemList=[];
    this.itemList=this.itemListTemp;
  }
  
}
