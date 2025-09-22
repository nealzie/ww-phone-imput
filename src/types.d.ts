declare module '@hugodev-oc/maz-ui-custom/components/MazPhoneNumberInput.mjs' {
  import { DefineComponent } from 'vue'
  
  interface MazPhoneNumberInputProps {
    modelValue?: string
    'onUpdate:modelValue'?: (value: string) => void
    'onUpdate:countryCode'?: (code: string) => void
    size?: string
    'show-code-on-list'?: boolean
    'preferred-countries'?: string[]
    'country-locale'?: string
    'auto-format'?: boolean
    style?: Record<string, string>
    disabled?: boolean
    error?: boolean
    success?: boolean
    translations?: Record<string, any>
  }

  interface MazPhoneNumberInputEmits {
    update: (data: any) => void
    data: (results: any) => void
    'country-code': (code: string) => void
  }

  const MazPhoneNumberInput: DefineComponent<MazPhoneNumberInputProps, {}, {}, {}, {}, {}, {}, MazPhoneNumberInputEmits>
  export default MazPhoneNumberInput
}

declare module '@hugodev-oc/maz-ui-custom/css/main.css' {
  const content: string
  export default content
} 