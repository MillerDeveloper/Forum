import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Company } from '../../interfaces/Company';
import * as imageConversion from 'image-conversion'

@Component({
  selector: 'app-company-info-card',
  templateUrl: './company-info-card.component.html',
  styleUrls: ['./company-info-card.component.scss']
})
export class CompanyInfoCardComponent implements OnInit {

  @Input() currentCompany: Company = null
  @Input() create: boolean = false
  @Output() submit = new EventEmitter()

  constructor() { }

  companyFormGroup: FormGroup
  addressFormGroup: FormGroup

  formDataFiles: FormData = new FormData()

  addresses = []
  tags = []
  phones = []

  ngOnInit(): void {
    this.addressFormGroup = new FormGroup({
      city: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required])
    })

    this.companyFormGroup = new FormGroup({
      name: new FormControl(this.currentCompany?.name, Validators.required),
      description: new FormControl(this.currentCompany?.description),
      site: new FormControl(this.currentCompany?.site),
      director: new FormControl(this.currentCompany?.director),
      tags: new FormControl(null),
      yearOfFoundation: new FormControl(this.currentCompany?.yearOfFoundation),
      licenseNo: new FormControl(this.currentCompany?.licenseNo),
      email: new FormControl(this.currentCompany?.email, [Validators.email]),
      address: new FormControl(null),
      street: new FormControl(null),
      avatar: new FormControl(null),
      phones: new FormControl(null)
    })

    var tags = ''
    this.currentCompany?.tags?.forEach((tag: any) => {
      tags += `${tag.name} `
    })
    
    var phones = ''
    this.currentCompany?.phones?.forEach((phone: any) => {
      phones += `${phone.phone} `
    })   

    this.companyFormGroup.patchValue({
      tags: tags,
      phones: phones,
      country: this.currentCompany?.address[0]?.country,
      city: this.currentCompany?.address[0]?.cities[0]?.city,
      address: this.currentCompany?.address[0]?.cities[0]?.addresses[0]
    })

    this.addressFormGroup.patchValue({
      country: this.currentCompany?.address[0]?.country,
      city: this.currentCompany?.address[0]?.cities[0]?.city,
      address: this.currentCompany?.address[0]?.cities[0]?.addresses[0]
    })
  }

  addTag() {
    this.tags.push({name: this.companyFormGroup.value.tags})
    this.companyFormGroup.patchValue({
      tags: null
    })
  }

  deleteTag(chip) {    
    const index = this.tags.findIndex(tag => tag.name === chip.name)
    if(index !== -1) {
      this.tags.splice(index, 1)
    }
  }

  addPhone() {        
    this.phones.push({phone: this.companyFormGroup.value.phones})
    this.companyFormGroup.patchValue({
      phones: null
    })
  }

  deletePhone(chip) {
    const index = this.phones.findIndex(phone => phone.phone === chip.name)
    this.phones.splice(index, 1)
  }

  addAddress() {
    const countryExists = this.addresses.findIndex(address => address.country === this.addressFormGroup.value.country)
    if(countryExists !== -1) {
      const cityExists = this.addresses[countryExists].cities.findIndex(item => item.city === this.addressFormGroup.value.city)
      if(cityExists !== -1) {
        this.addresses[countryExists].cities[cityExists].addresses.push(this.addressFormGroup.value.address)
      } else {
        this.addresses[countryExists].cities.push({
          city: this.addressFormGroup.value.city,
          addresses: [this.addressFormGroup.value.address]
        })
      }
    } else {
      this.addresses.push({
        country: this.addressFormGroup.value.country,
        cities: [{
          city: this.addressFormGroup.value.city,
          addresses: [this.addressFormGroup.value.address]
        }]
      })
    }  

    this.addressFormGroup.reset()
  }

  deleteAddress(chip) {    
    this.addresses.forEach((address, addressIndex) => {
      address.cities.forEach((city, cityIndex) => {
        const index = city.addresses.findIndex((addr) => addr === chip.name)
        if(index !== -1) {
          if(this.addresses[addressIndex].cities[cityIndex].addresses.length > 1) {
            this.addresses[addressIndex].cities[cityIndex].addresses.splice(index, 1)

            return
          } else if(this.addresses[addressIndex].cities[cityIndex].addresses.length === 1) {
            this.addresses[addressIndex].cities.splice(cityIndex, 1)
            if(this.addresses[addressIndex].cities.length === 0) {
              this.addresses.splice(addressIndex, 1)

              return
            }
          }
        }
      })
    })
  }

  uploadImage(event) {
    const files = <File>event.target.files
    if(files) {
      imageConversion.compress(files[0], 0.2)
      .then(res => {
        this.formDataFiles.append('avatar', res, files[0].name) 
      })
      .catch(error => {
        console.log(error)
      })
    }
  }

  submitForm() {
    const tags = []
    this.companyFormGroup.value?.tags?.split(' ')?.forEach(tag => {
      tags.push({name: tag})
    })

    const phones = []
    this.companyFormGroup.value?.phones?.split(' ')?.forEach(phone => {
      phones.push({phone: phone})
    })

    const address = []
    address.push({
      country: this.addressFormGroup.value.country,
      cities: [{
        city: this.addressFormGroup.value.city,
        addresses: [this.addressFormGroup.value.address] 
      }]
    })

    this.companyFormGroup.patchValue({
      phones: phones,
      address: address,
      tags: tags
    })

    const companyData = {
      formData: this.companyFormGroup.value,
      files: this.formDataFiles
    }

    this.submit.emit(companyData)
  }
}
