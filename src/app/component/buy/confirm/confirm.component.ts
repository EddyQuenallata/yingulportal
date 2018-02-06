import { Component, OnInit, Input,Output,EventEmitter} from '@angular/core';
import { PaymentMethod } from '../../../model/payment-method';  
import { Item } from '../../../model/item';
import { Buy } from '../../../model/buy';
import { BuyService } from '../../../service/buy.service'
import { Router } from '@angular/router';
import { user } from '../../../model/user';
import { AndreaniEnvios } from '../../../model/andreaniEnvios';
import { AndreaniSucursalRespuesta } from '../../../model/andreaniSucursalRespuesta';
import { AndreaniCotizacionRespuesta } from '../../../model/andreaniCotizacionRespuesta';
import { error } from 'util';
import { concat } from 'rxjs/operators/concat';
import { Cotizacion } from '../../../model/cotizacion';
import { Shipping } from '../../../model/shipping';
import { Product } from '../../../model/product';
@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  @Input('paymentMethod') paymentMethod:PaymentMethod= new PaymentMethod();
  @Input('quantity') quantity:number;
  @Input('Item') Item:Item;
  @Input('cost') cost:number=12;
  @Output() problem = new EventEmitter();
  @Input('shipping') shipping:Shipping=new Shipping();
  @Input('cotizacion') cotizacion:Cotizacion =new Cotizacion();
  @Input('product') product:Product =new Product();
  @Input('envioC') envioC:string;
  @Input('priceSuc') priceSuc:string;

  buy:Buy=new Buy();
  msg:string;
  sw:boolean;
  popup:boolean=true;
  popup2:boolean=true;
  phone:string;
  User: user=new user();
  dataForBuyer:Object=new Object();
  constructor(private buyService: BuyService, private router: Router) { 
  console.log("Cotizacion"+JSON.stringify(this.shipping));
    if(localStorage.getItem('user') == '' || localStorage.getItem('user') == null) {
      this.User = new user();
      this.router.navigate(['/login']);      
		} else {
			this.User=JSON.parse(localStorage.getItem("user"));
    }
    
    if(this.product.productPagoEnvio=="gratis"){this.popupCost=true;}
    else {this.popupCost=false}
    this.cost=this.cost+this.costosEnvio;
  }
  isComprador():boolean{

    if(this.product.productPagoEnvio=="comprador"){ 
      if(this.product.productPagoEnvio=="comprador"){
        if(this.shipping.typeShipping=="home")
        {
          this.costosEnvio=0;
        }
        else{
          this.costosEnvio=Number(this.shipping.yng_envio.tarifa);
         
      }

      }
      //this.costosEnvio=Number(this.shipping.yng_envio.tarifa);
      return true;}
    else {return false;}


  }
  isGratis():boolean{
    if(this.product.productPagoEnvio=="gratis"){ return true;}
    else {return false;}

  }

  popupCost:boolean=true;
  ngOnInit() {
    this.buyService.getSwForData(this.User.username).subscribe(
			res => {
            this.sw = JSON.parse(JSON.parse(JSON.stringify(res))._body);
      		},
      		error => console.log(error)
    );
    this.buyService.getDataForBuyer().subscribe(
			res => {
            this.dataForBuyer = JSON.parse(JSON.parse(JSON.stringify(res))._body);
            console.log(JSON.stringify(this.dataForBuyer));
      		},
      		error => console.log(error)
    );
    
  }
  costosEnvio:number=0;
  buyItem(){
    //aqui aumentas el precio del envio
    
    if(!this.sw){
      this.popup=false;
    } 
    else{
      this.popup2=false;
      this.buy.quantity=this.quantity;
      this.buy.yng_item=this.Item;
      this.buy.yng_item.user=null;
      this.buy.yng_PaymentMethod=this.paymentMethod;
      this.buy.user=this.paymentMethod.yng_Card.user;
      this.buy.ip=JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(this.dataForBuyer)).query));
      this.buy.org=JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(this.dataForBuyer)).org));
      this.buy.lat=JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(this.dataForBuyer)).lat));
      this.buy.lon=JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(this.dataForBuyer)).lon));
      this.buy.city=JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(this.dataForBuyer)).city));
      this.buy.country=JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(this.dataForBuyer)).country));
      this.buy.countryCode=JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(this.dataForBuyer)).countryCode));
      this.buy.regionName=JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(this.dataForBuyer)).regionName));
      this.buy.zip=JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(this.dataForBuyer)).zip));
      this.buy.cost=this.cost+this.costosEnvio;
      this.buy.shipping=this.shipping;
      
      console.log(JSON.stringify(this.buy));
      this.buyService.saveBuy(this.buy).subscribe(
        res => {
              this.msg = JSON.parse(JSON.stringify(res))._body;
              this.redirectTo();
            },
            error => console.log(error)
      )

      /*console.log(JSON.stringify(this.envio));
      this.buyService.saveEnvio(this.envio).subscribe(
        res => {
          console.log("envio:"+JSON.parse(JSON.stringify(res))._body)
          
        },
        error =>console.log(Error)
      )*/
    }
  }

  redirectTo(){
    this.popup2=true;
    if(this.msg=='problemCard'){
      this.problem.emit(this.msg);
    }
    if(this.msg=='save'){
      alert("compra realizada exitosamente revise su bandeja de entrada");
      this.router.navigate(['/']);   
    }else{
      alert(this.msg);
    } 
  }
  updateUser(){
    this.User.phone=this.phone;
    this.buyService.updateUser(this.User).subscribe(
      res => {
            this.msg = JSON.parse(JSON.stringify(res))._body;
            if(this.msg=='save'){
              this.sw=true;
              this.buyItem();
            }
            else{
              alert(this.msg);
            } 
          },
          error => console.log(error)
    );

    this.popup=true;
  }


}