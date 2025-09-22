<template>
  <div
    class="phone-input-container"
    :class="containerClasses"
    :data-size="currentSize"
  >
    <!-- Read Only View -->
    <div v-if="isReadOnly" class="phone-readonly-display">
      <div class="phone-flag">
        <span v-html="getCountryFlag(countryData.code)" class="country-flag"></span>
      </div>
      <span class="phone-number-text">{{ formattedPhoneNumber }}</span>
    </div>
    <div v-else-if="content.readOnly" class="phone-readonly-empty"></div>

    <!-- Regular Phone Input -->
    <MazPhoneNumberInput
      v-else
      v-model="localPhoneData.phoneNumber"
      v-model:country-code="localPhoneData.countryCode"
      block
      :size="currentSize"
      :orientation="content?.orientation ?? 'responsive'"
      :show-code-on-list="content?.showCodeOnList ?? true"
      :preferred-countries="preferredCountriesArray"
      :country-locale="countryLocale"
      :auto-format="content?.autoFormat ?? true"
      :dark="content?.darkMode ?? false"
      :style="mazInputStyles"
      :disabled="isLoading"
      :error="showError"
      :success="showSuccess"
      :translations="currentTranslations"
      @update="handleUpdate"
      @data="handleData"
      @country-code="handleCountryCode"
      class="work-sans-phone-input"
    >
      <template #selector-flag="{ countryCode }">
        <span v-html="getCountryFlag(countryCode)" class="country-flag"></span>
      </template>
      <template #country-list-flag="{ countryCode }">
        <span v-html="getCountryFlag(countryCode)" class="country-flag"></span>
      </template>
    </MazPhoneNumberInput>
    <div v-if="showError" class="error-message">
      {{ currentErrorMessage }}
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted, onErrorCaptured, watch } from 'vue'
import { AsYouType, parsePhoneNumber } from 'libphonenumber-js'
import MazPhoneNumberInput from '@hugodev-oc/maz-ui-custom/components/MazPhoneNumberInput.mjs'
import '@hugodev-oc/maz-ui-custom/css/main.css'
import * as countryFlagIcons from 'country-flag-icons/string/3x2'

// Translations object moved outside component for better performance
const translations = {
  en: {
    countrySelector: {
      placeholder: 'Country code',
      error: 'Choose country',
      searchPlaceholder: 'Search a country',
    },
    phoneInput: {
      placeholder: 'Phone number',
      example: 'Example:',
    },
  },
  fr: {
    countrySelector: {
      placeholder: 'Code pays',
      error: 'Choisissez un pays',
      searchPlaceholder: 'Rechercher un pays',
    },
    phoneInput: {
      placeholder: 'Numéro de téléphone',
      example: 'Exemple:',
    },
  },
}

// Default phone data structure
const defaultPhoneData = {
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
}

export default {
  name: 'PhoneInput',
  components: {
    MazPhoneNumberInput,
  },
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    wwElementState: { type: Object, required: true },
  },
  emits: ['update:content', 'trigger-event'],
  
  setup(props) {
    onErrorCaptured((err, instance, info) => {
      console.error('Component error:', err)
      console.info('Error instance:', instance)
      console.info('Error info:', info)
      return false
    })

    const phoneDataRef = ref({
      ...defaultPhoneData,
      phoneNumber: props.content?.initialValue?.phoneNumber || '',
      countryCode: props.content?.initialValue?.countryCode || 'US',
    })

    const { setValue, value } = wwLib.wwVariable.useComponentVariable({
      uid: props.wwElementState.uid,
      name: 'phoneData',
      defaultValue: phoneDataRef.value,
    })

    const data = computed(() => phoneDataRef.value)

    watch(value, (newValue) => {
      if (!newValue || typeof newValue !== 'object') return
      const hasChanges = Object.keys(newValue).some(key => 
        JSON.stringify(newValue[key]) !== JSON.stringify(phoneDataRef.value[key])
      )
      if (hasChanges) {
        phoneDataRef.value = { ...newValue }
      }
    }, { deep: true })

    const markdown = `### Phone Input Component
    
#### phoneData
Object containing phone input data:
- \`phoneNumber\`: Current phone number
- \`countryCode\`: Selected country code
- \`isValid\`: Validation status
- \`isPossible\`: Possibility status
- Additional formatting information`

    wwLib.wwElement.useRegisterElementLocalContext('phoneInput', data, {}, markdown)

    return {
      phoneData: phoneDataRef,
      setPhoneData: (newValue) => {
        if (!newValue || typeof newValue !== 'object') return
        const hasChanges = Object.keys(newValue).some(key => 
          JSON.stringify(newValue[key]) !== JSON.stringify(phoneDataRef.value[key])
        )
        if (hasChanges) {
          phoneDataRef.value = { ...phoneDataRef.value, ...newValue }
          setValue(phoneDataRef.value)
        }
      }
    }
  },

  data() {
    return {
      localPhoneData: { ...defaultPhoneData },
      isLoading: false,
      showError: false,
      showSuccess: false,
    }
  },

  computed: {
    containerClasses() {
      return {
        dark: this.content?.darkMode,
        'is-valid': this.localPhoneData.isValid,
        'is-invalid': !this.localPhoneData.isValid && this.localPhoneData.phoneNumber,
        'is-loading': this.isLoading,
      }
    },
    
    isReadOnly() {
      return this.content.readOnly && this.localPhoneData.phoneNumber
    },

    countryLocale() {
      return this.content?.language === 'fr' ? 'fr-FR' : 'en-US'
    },

    currentTranslations() {
      return translations[this.content?.language || 'en']
    },

    currentErrorMessage() {
      return this.content?.language === 'fr'
        ? 'Numéro de téléphone invalide'
        : 'Invalid phone number format'
    },

    countryData() {
      return {
        dialCode: this.getDialCode(this.localPhoneData.countryCode),
        code: this.localPhoneData.countryCode.toLowerCase()
      }
    },

    mazInputStyles() {
      const { content } = this
      return {
        '--maz-color-bg': content?.backgroundColor || '#ffffff',
        '--maz-color-bg-dark': content?.backgroundColor || '#ffffff',
        '--maz-color-bg-light': content?.backgroundColor || '#ffffff',
        '--maz-color-bg-lighter': content?.backgroundColor || '#ffffff',
        '--maz-color-text': content?.textColor || '#333333',
        '--maz-color-placeholder': content?.placeholderColor || '#999999',
        '--maz-border-radius': content?.borderRadius || '8px',
        '--maz-select-color': content?.textColor || '#333333',
        '--maz-dropdown-color': content?.textColor || '#333333',
        '--maz-dropdown-item-color': content?.textColor || '#333333',
        '--maz-dropdown-item-color-hover': content?.textColor || '#333333',
        '--maz-input-height': '36px',
        '--maz-border-color': content?.borderColor || 'rgba(0, 0, 0, 0.2)',
        '--maz-border-color-hover': content?.borderColor || 'rgba(0, 0, 0, 0.2)',
        '--maz-color-success': content?.successColor || '#28a745',
        '--maz-color-danger': content?.errorColor || '#ff6e6b',
        '--maz-color-success-50': `color-mix(in srgb, ${content?.successColor || '#28a745'} 10%, white)`,
        '--maz-color-success-100': `color-mix(in srgb, ${content?.successColor || '#28a745'} 20%, white)`,
        '--maz-color-success-200': `color-mix(in srgb, ${content?.successColor || '#28a745'} 40%, white)`,
        '--maz-color-success-300': `color-mix(in srgb, ${content?.successColor || '#28a745'} 60%, white)`,
        '--maz-color-success-400': `color-mix(in srgb, ${content?.successColor || '#28a745'} 80%, white)`,
        '--maz-color-success-600': `color-mix(in srgb, ${content?.successColor || '#28a745'} 80%, black)`,
        '--maz-color-success-700': `color-mix(in srgb, ${content?.successColor || '#28a745'} 60%, black)`,
        '--maz-color-success-800': `color-mix(in srgb, ${content?.successColor || '#28a745'} 40%, black)`,
        '--maz-color-success-900': `color-mix(in srgb, ${content?.successColor || '#28a745'} 20%, black)`,
        '--maz-color-danger-50': `color-mix(in srgb, ${content?.errorColor || '#ff6e6b'} 10%, white)`,
        '--maz-color-danger-100': `color-mix(in srgb, ${content?.errorColor || '#ff6e6b'} 20%, white)`,
        '--maz-color-danger-200': `color-mix(in srgb, ${content?.errorColor || '#ff6e6b'} 40%, white)`,
        '--maz-color-danger-300': `color-mix(in srgb, ${content?.errorColor || '#ff6e6b'} 60%, white)`,
        '--maz-color-danger-400': `color-mix(in srgb, ${content?.errorColor || '#ff6e6b'} 80%, white)`,
        '--maz-color-danger-600': `color-mix(in srgb, ${content?.errorColor || '#ff6e6b'} 80%, black)`,
        '--maz-color-danger-700': `color-mix(in srgb, ${content?.errorColor || '#ff6e6b'} 60%, black)`,
        '--maz-color-danger-800': `color-mix(in srgb, ${content?.errorColor || '#ff6e6b'} 40%, black)`,
        '--maz-color-danger-900': `color-mix(in srgb, ${content?.errorColor || '#ff6e6b'} 20%, black)`,
        // The following line was duplicated and had a syntax error; fix to only set it once and with correct value:
        '--maz-color-bg-lighter': content?.borderColor || 'rgba(0, 0, 0, 0.2)'
      }
    },

    formattedPhoneNumber() {
      if (!this.localPhoneData.phoneNumber) return ''
      
      try {
        if (this.localPhoneData.formatInternational) {
          return this.localPhoneData.formatInternational
        }
        
        const phoneNumber = parsePhoneNumber(
          this.localPhoneData.phoneNumber,
          this.localPhoneData.countryCode
        )
        if (phoneNumber) {
          return phoneNumber.formatInternational()
        }
      } catch (error) {
        console.warn('Phone formatting error:', error)
      }
      
      return `+${this.countryData.dialCode} ${this.localPhoneData.phoneNumber}`
    },

    preferredCountriesArray() {
      if (!this.content?.preferredCountries) {
        return ['FR', 'GB', 'CA', 'US', 'DE']
      }
      
      // Handle both string and array formats for backward compatibility
      if (Array.isArray(this.content.preferredCountries)) {
        return this.content.preferredCountries
      }
      
      // Convert comma-separated string to array
      if (typeof this.content.preferredCountries === 'string') {
        return this.content.preferredCountries
          .split(',')
          .map(country => country.trim())
          .filter(country => country.length > 0)
      }
      
      return ['FR', 'GB', 'CA', 'US', 'DE']
    },

    currentSize() {
      const size = this.content?.size || 'sm'
      console.log('Phone input size:', size)
      return size
    }
  },

  watch: {
    'content.language': {
      handler(newLang) {
        console.log('Language changed to:', newLang)
      },
      immediate: true,
    },
    'content.size': {
      handler(newSize) {
        console.log('Size changed to:', newSize)
      },
      immediate: true,
    },
    'content.initialValue': {
      handler(newValue) {
        if (!newValue || typeof newValue !== 'object') return
        
        if (newValue.phoneNumber || newValue.countryCode) {
          const newData = {
            ...this.localPhoneData,
            phoneNumber: newValue.phoneNumber || '',
            countryCode: newValue.countryCode || 'US'
          }

          const hasChanges = 
            newValue.phoneNumber !== this.localPhoneData.phoneNumber || 
            newValue.countryCode !== this.localPhoneData.countryCode

          if (hasChanges) {
            this.localPhoneData = newData
            this.setPhoneData(newData)
          }
        }
      },
      deep: true,
      immediate: true
    },
    phoneData: {
      handler(newValue) {
        if (!newValue || typeof newValue !== 'object') return
        
        const hasChanges = Object.keys(newValue).some(key => 
          JSON.stringify(newValue[key]) !== JSON.stringify(this.localPhoneData[key])
        )
        
        if (hasChanges) {
          this.localPhoneData = { ...this.localPhoneData, ...newValue }
          // Note: Change events are now emitted directly in handleUpdate, handleData, and handleCountryCode methods
        }
      },
      deep: true,
      immediate: true
    },
  },

  methods: {
    // Centralized method to emit change event
    emitChangeEvent() {
      this.$emit('trigger-event', { name: 'change', event: this.localPhoneData })
    },

    // Fired when the underlying v-model (raw phone string) changes
    handleModelValue(phoneNumber) {
      const normalizedPhone = phoneNumber ?? ''
      if (normalizedPhone !== this.localPhoneData.phoneNumber) {
        const newData = { ...this.localPhoneData, phoneNumber: normalizedPhone }
        this.localPhoneData = newData
        this.setPhoneData(newData)
        this.emitChangeEvent()
      }
    },

    async handleUpdate(data) {
      if (!data) return

      // Normalize payload so clearing the input propagates an empty value
      const normalizedData = {
        ...data,
        phoneNumber: data.phoneNumber ?? '',
        nationalNumber: data.nationalNumber ?? '',
      }

      const newData = { ...this.localPhoneData, ...normalizedData }
      const hasChanges = Object.keys(normalizedData).some(key =>
        JSON.stringify(normalizedData[key]) !== JSON.stringify(this.localPhoneData[key])
      )

      if (hasChanges) {
        this.localPhoneData = newData
        this.setPhoneData(newData)
        // Only emit change event here for user input updates
        this.emitChangeEvent()
      }
    },

    handleData(results) {
      if (!results) return

      try {
        const phoneNumber = parsePhoneNumber(results.phoneNumber || '', results.countryCode)
        const formatter = new AsYouType(results.countryCode)
        formatter.input(results.phoneNumber || '')
        
        const newData = {
          ...this.localPhoneData,
          ...results,
          // Ensure we drop the last digit when field is cleared
          phoneNumber: results.phoneNumber ?? '',
          formatInternational: phoneNumber ? phoneNumber.formatInternational() : '',
          formatNational: formatter.getNumber()?.formatNational || formatter.getFormattedNumber(),
          e164: phoneNumber ? phoneNumber.format('E.164') : '',
          nationalNumber: results.nationalNumber ?? '',
          countryCallingCode: results.countryCallingCode ?? '',
          isPossible: results.isPossible || false,
          isValid: results.isValid || false
        }

        const hasChanges = Object.keys(newData).some(key => 
          JSON.stringify(newData[key]) !== JSON.stringify(this.localPhoneData[key])
        )

        if (hasChanges) {
          this.localPhoneData = newData
          this.setPhoneData(newData)
          // Don't emit change event here as it's already emitted in handleUpdate
        }
      } catch (error) {
        console.warn('Phone formatting error:', error)
      }
    },

    handleCountryCode(countryCode) {
      if (countryCode !== this.localPhoneData.countryCode) {
        this.localPhoneData.countryCode = countryCode
        this.setPhoneData(this.localPhoneData)
        // Emit both country-change and change events when country is changed
        this.$emit('trigger-event', { name: 'country-change', event: { countryCode } })
        this.emitChangeEvent()
      }
    },

    getDialCode(code) {
      const dialCodes = {
        'US': '1',
        'GB': '44',
        'FR': '33',
        'DE': '49',
        'IT': '39',
        'ES': '34',
        'CA': '1',
      }
      return dialCodes[code] || ''
    },

    getCountryFlag(countryCode) {
      const code = countryCode.toUpperCase()
      if (countryFlagIcons[code]) {
        return countryFlagIcons[code]
      }
      console.warn(`No flag found for country code: ${code}`)
      return ''
    }
  },
}
</script>

<style lang="css" scoped>
.phone-input-container {
  position: relative;
  width: 100%;
  transition: none;
}

/* Ensure the Maz phone input stretches to full container width */
.phone-input-container :deep(.maz-phone-number-input),
.phone-input-container :deep(.maz-input-phone-number),
.phone-input-container :deep(.m-phone-input) {
  width: 100% !important;
  min-width: 0 !important;
}

/* Override Maz UI default styles */
.phone-input-container :deep(.maz-input) {
  --maz-bg-color: var(--input-bg-color) !important;
  --maz-color-bg: var(--maz-color-bg) !important;
  --maz-color-bg-dark: var(--maz-color-bg) !important;
  --maz-color-bg-light: var(--maz-color-bg) !important;
  --maz-color-bg: v-bind('content?.borderColor || "rgba(0, 0, 0, 0.2)"') !important;
}

/* Fix column orientation layout */
.phone-input-container :deep(.maz-phone-number-input.--orientation-col) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}


.phone-input-container :deep(.maz-phone-number-input.--orientation-col .maz-select) {
  margin-bottom: 0;
}

.phone-input-container :deep(.maz-phone-number-input.--orientation-col .maz-input) {
  margin-top: 0;
}
/* make the host container full width */
.phone-input-container {
  width: 100%;
  display: block;
}

/* make the Maz component and its wrappers full width */
.phone-input-container :deep(.maz-phone-number-input),
.phone-input-container :deep(.m-phone-input),
.phone-input-container :deep(.m-input-wrapper),
.phone-input-container :deep(.m-input-wrapper-input),
.phone-input-container :deep(.maz-input),
.phone-input-container :deep(.m-input) {
  width: 100% !important;
  max-width: 100% !important;   /* override any internal cap (e.g., 320px) */
  min-width: 0 !important;      /* avoid flex min-width squeezing issues */
}

/* ensure the actual <input> fills the line */
.phone-input-container :deep(input.m-input-input) {
  width: 100% !important;
}

/* Fix row orientation layout */
.phone-input-container :deep(.maz-phone-number-input.--orientation-row) {
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: flex-end;
}



.phone-input-container :deep(.maz-phone-number-input.--orientation-row .maz-input) {
  flex: 1;
}

/* Fix dropdown caret visibility */
.phone-input-container {
  :deep(.maz-select) {
    .maz-select__caret {
      opacity: 1 !important;
      color: v-bind('content?.textColor || "#333333"') !important;
      margin-right: 4px;
    }

    .maz-select__input {
      padding-right: 24px !important;
    }
  }

  :deep(.maz-select__input-wrapper) {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.error-message {
  color: v-bind('content?.errorColor || "#dc3545"');
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.phone-input-container.is-loading {
  pointer-events: none;
}

.phone-input-container :deep(.m-input:not(.--has-state)) {
  color: v-bind('content?.labelColor || "#333333"');
}

.phone-readonly-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  background-color: var(--ww-color-light-100);
  
  .phone-flag {
    display: flex;
    align-items: center;
  }
  
  .phone-number-text {
    color: v-bind('content?.textColor || "#333333"');
    font-size: v-bind('content?.readOnlyFontSize || "14px"');
  }
}
.m-phone-input{
  min-width:unset !important;
}

.phone-readonly-empty {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  background-color: var(--ww-color-light-100);
  color: v-bind('content?.placeholderColor || "#999999"');
  font-size: v-bind('content?.readOnlyFontSize || "14px"');
}

.country-flag {
  display: inline-flex;
  width: 20px;
  height: 15px;

  :deep(svg) {
    width: 100%;
    height: 100%;
    border-radius: 2px;
    display: block;
  }
}


.phone-input-container :deep(.maz-phone-number-input[data-size="mini"] .country-flag),
.phone-input-container :deep(.maz-phone-number-input[data-size="mini"] .maz-select__flag),
.phone-input-container :deep(.maz-phone-number-input.--size-mini .country-flag),
.phone-input-container :deep(.maz-phone-number-input.--size-mini .maz-select__flag) {
  width: 14px;
  height: 11px;
}

.phone-input-container :deep(.maz-phone-number-input[data-size="xs"] .country-flag),
.phone-input-container :deep(.maz-phone-number-input[data-size="xs"] .maz-select__flag),
.phone-input-container :deep(.maz-phone-number-input.--size-xs .country-flag),
.phone-input-container :deep(.maz-phone-number-input.--size-xs .maz-select__flag) {
  width: 15px;
  height: 12.5px;
}

.phone-input-container :deep(.maz-phone-number-input[data-size="sm"] .country-flag),
.phone-input-container :deep(.maz-phone-number-input[data-size="sm"] .maz-select__flag),
.phone-input-container :deep(.maz-phone-number-input.--size-sm .country-flag),
.phone-input-container :deep(.maz-phone-number-input.--size-sm .maz-select__flag) {
  width: 20px;
  height: 15px;
}

.phone-input-container :deep(.maz-phone-number-input[data-size="md"] .country-flag),
.phone-input-container :deep(.maz-phone-number-input[data-size="md"] .maz-select__flag),
.phone-input-container :deep(.maz-phone-number-input.--size-md .country-flag),
.phone-input-container :deep(.maz-phone-number-input.--size-md .maz-select__flag) {
  width: 22px;
  height: 16.5px;
}

.phone-input-container :deep(.maz-phone-number-input[data-size="lg"] .country-flag),
.phone-input-container :deep(.maz-phone-number-input[data-size="lg"] .maz-select__flag),
.phone-input-container :deep(.maz-phone-number-input.--size-lg .country-flag),
.phone-input-container :deep(.maz-phone-number-input.--size-lg .maz-select__flag) {
  width: 24px;
  height: 18px;
}

.phone-input-container :deep(.maz-phone-number-input[data-size="xl"] .country-flag),
.phone-input-container :deep(.maz-phone-number-input[data-size="xl"] .maz-select__flag),
.phone-input-container :deep(.maz-phone-number-input.--size-xl .country-flag),
.phone-input-container :deep(.maz-phone-number-input.--size-xl .maz-select__flag) {
  width: 26px;
  height: 19.5px;
}

/* Alternative approach - target the container with size attribute */
.phone-input-container[data-size="mini"] :deep(.country-flag),
.phone-input-container[data-size="mini"] :deep(.maz-select__flag) {
  width: 13px;
  height: 11px;
}

.phone-input-container[data-size="xs"] :deep(.country-flag),
.phone-input-container[data-size="xs"] :deep(.maz-select__flag) {
 width: 15px;
  height: 12.5px;
}

.phone-input-container[data-size="sm"] :deep(.country-flag),
.phone-input-container[data-size="sm"] :deep(.maz-select__flag) {
  width: 20px;
  height: 15px;
}

.phone-input-container[data-size="md"] :deep(.country-flag),
.phone-input-container[data-size="md"] :deep(.maz-select__flag) {
  width: 22px;
  height: 16.5px;
}

.phone-input-container[data-size="lg"] :deep(.country-flag),
.phone-input-container[data-size="lg"] :deep(.maz-select__flag) {
  width: 24px;
  height: 18px;
}

.phone-input-container[data-size="xl"] :deep(.country-flag),
.phone-input-container[data-size="xl"] :deep(.maz-select__flag) {
  width: 26px;
  height: 19.5px;
}

/* Flag display improvements */
.phone-input-container :deep(.maz-select__flag),
.phone-readonly-display .phone-flag {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.phone-input-container :deep(.maz-select__options-list-item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  

  .country-flag {
    flex-shrink: 0;
  }
}

/* Style the country name text in dropdown */
.phone-input-container :deep(.maz-flex-1.maz-truncate:not(.maz-font-semibold)) {
  color: v-bind('content?.textColor || "#333333"') !important;
}


.phone-readonly-display .country-flag {
  flex-shrink: 0;
}
</style>
