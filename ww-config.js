export default {
  editor: {
    label: {
      en: 'Phone Input',
    },
    icon: 'phone',
  },
  properties: {
    initialValue: {
      label: {
        en: 'Initial value',
        fr: 'Valeur initiale'
      },
      type: 'object',
      section: 'settings',
      bindable: true,
      defaultValue: {
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'object',
        properties: {
          phoneNumber: { 
            type: 'string',
            description: 'The initial phone number'
          },
          countryCode: { 
            type: 'string',
            description: 'The initial country code (e.g. "US", "FR", "GB")'
          }
        },
        tooltip: 'An object containing phoneNumber and countryCode'
      }
      /* wwEditor:end */
    },
    labelColor: {
      label: {
        en: 'Label color'
      },
      type: 'Color',
      classes: true,
      bindable: true,
      responsive: true,
      states: true,
      defaultValue: '#333333',
      section: 'styling',
      /* wwEditor:start */
      bindingValidation: {
        cssSupports: 'color',
        type: 'string',
        tooltip: 'A string that represents a color code for the input labels'
      }
      /* wwEditor:end */
    },
    borderColor: {
      label: {
        en: 'Border color'
      },
      type: 'Color',
      classes: true,
      bindable: true,
      responsive: true,
      states: true,
      defaultValue: 'rgba(0, 0, 0, 0.2)',
      section: 'styling',
      /* wwEditor:start */
      bindingValidation: {
        cssSupports: 'border-color',
        type: 'string',
        tooltip: 'A string that represents a color code for the input borders'
      }
      /* wwEditor:end */
    },
    backgroundColor: {
      label: {
        en: 'Background color'
      },
      type: 'Color',
      classes: true,
      bindable: true,
      responsive: true,
      states: true,
      defaultValue: '#ffffff',
      section: 'styling',
      /* wwEditor:start */
      bindingValidation: {
        cssSupports: 'background-color',
        type: 'string',
        tooltip: 'A string that represents a color code: `"#ffffff" | "#000000" | "rgb(255, 255, 255)"`'
      }
      /* wwEditor:end */
    },
    textColor: {
      label: {
        en: 'Text color',
      },
      type: 'Color',
      classes: true,
      bindable: true,
      responsive: true,
      states: true,
      defaultValue: '#333333',
      section: 'styling',
      /* wwEditor:start */
      bindingValidation: {
        cssSupports: 'color',
        type: 'string',
        tooltip: 'A string that represents a color code for the input text',
      },
      /* wwEditor:end */
    },
    placeholderColor: {
      label: {
        en: 'Placeholder color',
      },
      type: 'Color',
      classes: true,
      bindable: true,
      responsive: true,
      states: true,
      defaultValue: '#999999',
      section: 'styling',
      /* wwEditor:start */
      bindingValidation: {
        cssSupports: 'color',
        type: 'string',
        tooltip: 'A string that represents a color code for the placeholder text',
      },
      /* wwEditor:end */
    },
    darkMode: {
      label: { en: 'Dark mode' },
      type: 'OnOff',
      bindable: true,
      defaultValue: false,
      section: 'styling',
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Toggle dark mode appearance',
      },
      /* wwEditor:end */
    },
    language: {
      label: { en: 'Language', fr: 'Langue' },
      type: 'TextSelect',
      defaultValue: 'en',
      section: 'settings',
      bindable: true,
      options: {
        options: [
          { value: 'en', label: { en: 'English', fr: 'Anglais' } },
          { value: 'fr', label: { en: 'French', fr: 'Français' } },
        ],
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Select the language for labels and placeholders',
      },
      /* wwEditor:end */
    },
    showCodeOnList: {
      label: { en: 'Show code on list' },
      type: 'OnOff',
      bindable: true,
      defaultValue: true,
      section: 'settings',
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Show country code in the dropdown list',
      },
      /* wwEditor:end */
    },
    defaultCountry: {
      label: { 
        en: 'Default country',
        fr: 'Pays par défaut'
      },
      type: 'Text',
      bindable: true,
      defaultValue: '',
      section: 'settings',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'ISO country code (e.g., "US", "FR", "GB"). Leave empty to auto-detect from user locale',
      },
      propertyHelp: 'Set the default country code for the phone input. Use ISO country codes like "US", "FR", "GB", etc. Leave empty to automatically detect from user\'s browser locale.',
      /* wwEditor:end */
    },
    preferredCountries: {
      label: { 
        en: 'Preferred countries',
        fr: 'Pays préférés'
      },
      type: 'Text',
      bindable: true,
      defaultValue: 'FR,GB,CA,US,DE',
      section: 'settings',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Comma-separated list of country codes (e.g., "FR,GB,CA,US,DE") to show at the top of the dropdown',
      },
      /* wwEditor:end */
    },

    autoFormat: {
      label: { en: 'Auto format' },
      type: 'OnOff',
      bindable: true,
      defaultValue: true,
      section: 'settings',
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Automatically format phone numbers',
      },
      /* wwEditor:end */
    },
    orientation: {
      label: { en: 'Orientation', fr: 'Orientation' },
      type: 'TextSelect',
      bindable: true,
      defaultValue: 'responsive',
      section: 'styling',
      options: {
        options: [
          { value: 'responsive', label: { en: 'Responsive', fr: 'Responsive' } },
          { value: 'row', label: { en: 'Row', fr: 'Ligne' } },
          { value: 'col', label: { en: 'Column', fr: 'Colonne' } },
        ],
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Layout orientation of the component',
      },
      /* wwEditor:end */
    },
    readOnly: {
      label: {
        en: "Read Only",
        fr: "Lecture seule"
      },
      type: "OnOff",
      section: "settings",
      bindable: true,
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Toggle read-only mode for the phone input'
      }
      /* wwEditor:end */
    },
    successColor: {
      label: {
        en: 'Success color',
        fr: 'Couleur de succès'
      },
      type: 'Color',
      classes: true,
      bindable: true,
      responsive: true,
      states: true,
      defaultValue: '#28a745',
      section: 'styling',
      /* wwEditor:start */
      bindingValidation: {
        cssSupports: 'color',
        type: 'string',
        tooltip: 'A string that represents a color code for success state. This will automatically generate lighter and darker shades.'
      }
      /* wwEditor:end */
    },
    errorColor: {
      label: {
        en: 'Error color',
        fr: 'Couleur d\'erreur'
      },
      type: 'Color',
      classes: true,
      bindable: true,
      responsive: true,
      states: true,
      defaultValue: '#dc3545',
      section: 'styling',
      /* wwEditor:start */
      bindingValidation: {
        cssSupports: 'color',
        type: 'string',
        tooltip: 'A string that represents a color code for error state'
      }
      /* wwEditor:end */
    },
    size: {
      label: {
        en: 'Size',
        fr: 'Taille'
      },
      type: 'TextSelect',
      bindable: true,
      defaultValue: 'sm',
      section: 'styling',
      options: {
        options: [
          { value: 'mini', label: { en: 'Mini', fr: 'Mini' } },
          { value: 'xs', label: { en: 'Extra Small', fr: 'Très petit' } },
          { value: 'sm', label: { en: 'Small', fr: 'Petit' } },
          { value: 'md', label: { en: 'Medium', fr: 'Moyen' } },
          { value: 'lg', label: { en: 'Large', fr: 'Grand' } },
          { value: 'xl', label: { en: 'Extra Large', fr: 'Très grand' } },
        ],
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Select the size of the phone input component',
      },
      /* wwEditor:end */
    },
    readOnlyFontSize: {
      label: {
        en: 'Read-only font size',
        fr: 'Taille de police (lecture seule)'
      },
      type: 'Text',
      classes: true,
      bindable: true,
      responsive: true,
      states: true,
      defaultValue: '14px',
      section: 'styling',
      /* wwEditor:start */
      bindingValidation: {
        cssSupports: 'font-size',
        type: 'string',
        tooltip: 'CSS font-size value for read-only text (e.g., "14px")'
      }
      /* wwEditor:end */
    },
    borderRadius: {
      label: {
        en: 'Border radius',
        fr: 'Rayon de bordure'
      },
      type: 'Text',
      bindable: true,
      responsive: true,
      states: true,
      defaultValue: '8px',
      section: 'styling',
      /* wwEditor:start */
      bindingValidation: {
        cssSupports: 'border-radius',
        type: 'string',
        tooltip: 'Border radius for the input fields (e.g., "8px", "4px", "12px")'
      }
      /* wwEditor:end */
    },
  },
  variables: {
    phoneData: {
      type: 'object',
      name: 'phoneData',
      defaultValue: {
        phoneNumber: '',
        countryCode: 'US',
        isValid: false,
        isPossible: false,
        countryCallingCode: '',
        nationalNumber: '',
        formatInternational: '',
        formatNational: '',
        type: '',
        e164: '',
        regionCode: '',
        number: {
          input: '',
          international: '',
          national: '',
          e164: '',
          rfc3966: '',
          significant: '',
        },
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'object',
        properties: {
          phoneNumber: { type: 'string' },
          countryCode: { type: 'string' },
          isValid: { type: 'boolean' },
          isPossible: { type: 'boolean' },
          countryCallingCode: { type: 'string' },
          nationalNumber: { type: 'string' },
          formatInternational: { type: 'string' },
          formatNational: { type: 'string' },
          type: { type: 'string' },
          e164: { type: 'string' },
          regionCode: { type: 'string' },
          number: {
            type: 'object',
            properties: {
              input: { type: 'string' },
              international: { type: 'string' },
              national: { type: 'string' },
              e164: { type: 'string' },
              rfc3966: { type: 'string' },
              significant: { type: 'string' },
            },
          },
        },
      },
      /* wwEditor:end */
    },
  },
  triggerEvents: [
    {
      name: 'change',
      label: { en: 'On change' },
      event: {
        phoneNumber: { type: 'Text' },
        countryCode: { type: 'Text' },
        isValid: { type: 'Boolean' },
        isPossible: { type: 'Boolean' },
        countryCallingCode: { type: 'Text' },
        nationalNumber: { type: 'Text' },
        formatInternational: { type: 'Text' },
        formatNational: { type: 'Text' },
        type: { type: 'Text' },
        e164: { type: 'Text' },
        regionCode: { type: 'Text' },
        number: {
          type: 'Object',
          properties: {
            input: { type: 'Text' },
            international: { type: 'Text' },
            national: { type: 'Text' },
            e164: { type: 'Text' },
            rfc3966: { type: 'Text' },
            significant: { type: 'Text' },
          },
        },
      },
    },
    {
      name: 'country-change',
      label: { en: 'On country change' },
      event: {
        countryCode: { type: 'Text' },
      },
    },
  ],
}
