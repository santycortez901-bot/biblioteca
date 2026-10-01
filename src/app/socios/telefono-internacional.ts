import {AfterViewInit,booleanAttribute,Component,ElementRef,forwardRef,Input,OnDestroy,ViewChild} from '@angular/core';
import {ControlValueAccessor,NG_VALIDATORS,NG_VALUE_ACCESSOR,ValidationErrors,Validator} from '@angular/forms';
import intlTelInput,{type Iti} from 'intl-tel-input';

@Component({
  selector:'app-telefono-internacional',
  standalone:true,
  template:'<input #phoneInput type="tel" autocomplete="tel" [id]="id" [required]="required" (input)="actualizarValor()" (blur)="marcarTocado()">',
  providers:[
    {
      provide:NG_VALUE_ACCESSOR,
      useExisting:forwardRef(() => TelefonoInternacional),
      multi:true,
    },
    {
      provide:NG_VALIDATORS,
      useExisting:forwardRef(() => TelefonoInternacional),
      multi:true,
    },
  ],
})
export class TelefonoInternacional implements AfterViewInit,OnDestroy,ControlValueAccessor,Validator {
  @ViewChild('phoneInput',{static:true})
  private phoneInput!: ElementRef<HTMLInputElement>;

  @Input() id = 'telefono';
  @Input({transform:booleanAttribute}) required = false;

  private instance?: Iti;
  private value = '';
  private change: (value: string) => void = () => {};
  private touched: () => void = () => {};
  private validatorChange: () => void = () => {};

  ngAfterViewInit(): void {
    this.instance = intlTelInput(this.phoneInput.nativeElement,{
      initialCountry:'ar',
      countryOrder:['ar','pe'],
      separateDialCode:true,
      countrySearch:true,
      loadUtils:() => import('intl-tel-input/utils'),
    });

    this.phoneInput.nativeElement.addEventListener(
      'countrychange',
      this.actualizarValor
    );

    if (this.value) {
      this.instance.setNumber(this.value);
    }

    void this.instance.promise.then(() => {
      this.actualizarValor();
      this.validatorChange();
    });
  }

  ngOnDestroy(): void {
    this.phoneInput.nativeElement.removeEventListener(
      'countrychange',
      this.actualizarValor
    );
    this.instance?.destroy();
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
    if (this.instance) {
      this.instance.setNumber(this.value);
    }
  }

  registerOnChange(change: (value: string) => void): void {
    this.change = change;
  }

  registerOnTouched(touched: () => void): void {
    this.touched = touched;
  }

  setDisabledState(disabled: boolean): void {
    this.phoneInput.nativeElement.disabled = disabled;
  }

  validate(): ValidationErrors | null {
    if (!this.value) {
      return this.required ? {required:true} : null;
    }

    return this.instance?.isValidNumber() === false
      ? {phoneInvalid:true}
      : null;
  }

  registerOnValidatorChange(change: () => void): void {
    this.validatorChange = change;
  }

  actualizarValor = (): void => {
    if (!this.instance) {
      return;
    }

    this.value = this.instance.getNumber(intlTelInput.NUMBER_FORMAT.E164);
    this.change(this.value);
    this.validatorChange();
  };

  marcarTocado(): void {
    this.touched();
  }
}