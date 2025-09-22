# Phone Input Component for WeWeb

A customizable international phone number input component for WeWeb, built using Maz-UI's phone number input component.

## Features

- International phone number input with country selection
- Dark mode support
- Customizable preferred countries
- Responsive layout options
- Automatic number formatting
- Validation and formatting using libphonenumber-js
- Country name localization

## Properties

- `darkMode` (boolean): Toggle dark mode appearance
- `showCodeOnList` (boolean): Show country code in the dropdown list
- `preferredCountries` (array): Array of preferred country codes to show at the top
- `countryLocale` (string): Locale for country names display
- `autoFormat` (boolean): Automatically format phone numbers
- `orientation` (string): Layout orientation ('responsive', 'row', or 'column')

## Events

The component emits a 'change' event with the following data:

- `phoneNumber`: The complete phone number
- `countryCode`: The selected country code
- `isValid`: Whether the number is valid
- `isPossible`: Whether the number is possible
- `countryCallingCode`: The country calling code
- `nationalNumber`: The national number part
- `formatInternational`: The number in international format
- `formatNational`: The number in national format

## Variables

The component exposes a `phoneData` variable containing all the above phone number information.

## Usage

1. Add the component to your WeWeb project
2. Configure the properties as needed
3. Use the emitted events and variables to handle phone number data

## Dependencies

- maz-ui: ^3.50.1
- libphonenumber-js: ^1.10.0
