import { Observable } from 'tns-core-modules/data/observable';
import { MutualTls } from 'nativescript-mutual-tls';

export class HelloWorldModel extends Observable {
  public message: string;
  private mutualTls: MutualTls;

  constructor() {
    super();

    this.mutualTls = new MutualTls();
    this.message = this.mutualTls.message;
  }
}
