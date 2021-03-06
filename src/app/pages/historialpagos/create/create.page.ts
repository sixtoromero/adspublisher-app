import { Component, OnInit, Input } from '@angular/core';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { PlanModel } from '../../../models/plan.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {


  constructor(private payPal: PayPal) { }

  paymentAmount: string = '17000';
  currency: string = 'USD';
  currencyIcon: string = '$';

  ngOnInit() {
  }

  payWithPaypal() {
    
    this.payPal.init({
      PayPalEnvironmentProduction: 'AViS202nQP2glu8nQRwqaZtX23CuSS2rF0ehZSr7WwmjwaVlKxgOxFh_XRXjqxouw2dheqw7YwFBLnFl',
      PayPalEnvironmentSandbox: 'AViS202nQP2glu8nQRwqaZtX23CuSS2rF0ehZSr7WwmjwaVlKxgOxFh_XRXjqxouw2dheqw7YwFBLnFl'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      //Ads-Publisher	
      //this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        const payment = new PayPalPayment(this.paymentAmount, this.currency, 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          
          console.log(res);
          // Successfully paid

          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          // Error or render dialog closed without being successful
        });
      }, () => {
        // Error in configuration
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
    });
  }

}
