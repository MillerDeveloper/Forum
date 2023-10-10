export interface Company {
     _id: string,
     name: string, 
     description: string, 
     dateCreate: Date, 
     logo: string, 
     rating: number, 
     site: string,
     email: string,
     address: [{
          country: string,
          cities: [{
               city: string,
               addresses: string[]
          }]
     }], 
     director: string,
     city: string,
     comments: any[],
     specialization: string,
     yearOfFoundation: string,
     licenseNo: string,
     tags: string[],
     phones: [{
          phone: string
     }],
     visitorsCount: number
}