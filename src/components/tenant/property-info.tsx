import * as React from 'react'
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

const propertyInfo = {
  name: 'Sunset Apartments',
  unit: 'Unit 304',
  address: {
    street: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105'
  },
  amenities: [
    'In-unit Washer/Dryer',
    'Central Air',
    'Dishwasher',
    'Parking Space (#45)',
    'Storage Unit (#304B)'
  ],
  contacts: {
    propertyManager: {
      name: 'Sarah Johnson',
      phone: '(415) 555-0123',
      email: 'sarah@sunsetapts.com'
    },
    maintenance: {
      name: 'Maintenance Team',
      phone: '(415) 555-0124',
      email: 'maintenance@sunsetapts.com'
    }
  }
}

export function PropertyInfo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium">{propertyInfo.name}</h3>
        <div className="mt-2 flex items-start space-x-2 text-sm text-muted-foreground">
          <MapPinIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div>
            <p>{propertyInfo.unit}</p>
            <p>{propertyInfo.address.street}</p>
            <p>
              {propertyInfo.address.city}, {propertyInfo.address.state}{' '}
              {propertyInfo.address.zip}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium">Amenities</h4>
        <ul className="mt-2 space-y-1">
          {propertyInfo.amenities.map((amenity, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              {amenity}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-medium">Property Manager</h4>
        <div className="mt-2 space-y-2">
          <p className="text-sm">{propertyInfo.contacts.propertyManager.name}</p>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <PhoneIcon className="h-4 w-4" />
            <span>{propertyInfo.contacts.propertyManager.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <EnvelopeIcon className="h-4 w-4" />
            <span>{propertyInfo.contacts.propertyManager.email}</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium">Maintenance Contact</h4>
        <div className="mt-2 space-y-2">
          <p className="text-sm">{propertyInfo.contacts.maintenance.name}</p>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <PhoneIcon className="h-4 w-4" />
            <span>{propertyInfo.contacts.maintenance.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <EnvelopeIcon className="h-4 w-4" />
            <span>{propertyInfo.contacts.maintenance.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 